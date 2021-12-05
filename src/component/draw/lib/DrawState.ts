import { List, OrderedSet, Record, Set } from "immutable";
import { Dispatch, SetStateAction } from "react";
import { Point } from "./draw";
import { v4 as getUid } from "uuid";

type DrawStateRecordType = {
  state: "drawing" | "revoking";
  strokes: List<{
    uid: string;
    points: Point[];
  }>;
  uidStack: List<string>;
  undoStack: OrderedSet<string>;
  eraseStack: List<{
    uid: string;
    erased: Set<string>;
  }>;
  deleted: Set<string>;
  position: List<Set<string>>;
};

type DrawStateRecord = Record<DrawStateRecordType>;

const defaultRecord: Readonly<DrawStateRecordType> = {
  state: "drawing",
  strokes: List(),
  uidStack: List(),
  undoStack: OrderedSet(),
  eraseStack: List(),
  deleted: Set(),
  position: List<Set<string>>(),
};

const defaultFactory = Record(defaultRecord);

export class DrawState {
  constructor(
    private immutable: DrawStateRecord,
    private width: number,
    private height: number
  ) {}

  getImmutable() {
    return this.immutable;
  }

  getUidStack() {
    return this.getImmutable().get("uidStack");
  }

  getUndoStack() {
    return this.getImmutable().get("undoStack");
  }

  getEraseStack() {
    return this.getImmutable().get("eraseStack");
  }

  getValidEraseStack() {
    const deleted = this.getDeleted();
    const undo = this.getUndoStack();
    return this.getEraseStack().filter(
      ({ uid }) => !deleted.has(uid) && !undo.has(uid)
    );
  }

  getStrokes() {
    return this.getImmutable().get("strokes");
  }

  getValidStrokes() {
    const deleted = this.getDeleted();
    const undo = this.getUndoStack();
    const erase = this.getValidEraseStack();
    return this.getStrokes().filter(
      ({ uid }) =>
        !deleted.has(uid) &&
        !undo.has(uid) &&
        !erase.some((s) => s.erased.has(uid))
    );
  }

  getDeleted() {
    return this.getImmutable().get("deleted");
  }

  getState() {
    return this.getImmutable().get("state");
  }

  getPosition() {
    return this.getImmutable().get("position");
  }

  static createEmpty(width: number, height: number) {
    return new DrawState(defaultFactory(), width, height);
  }

  static undo(drawState: DrawState) {
    const uid = drawState.getUidStack().last();

    if (!uid) {
      return drawState;
    }

    return new DrawState(
      drawState
        .getImmutable()
        .set("state", "revoking")
        .update("undoStack", (s) => s.add(uid))
        .update("uidStack", (s) => s.pop()),
      drawState.width,
      drawState.height
    );
  }

  static redo(drawState: DrawState) {
    const undo = drawState.getUndoStack();
    const uid = undo.last();
    if (!uid) return drawState;
    return new DrawState(
      drawState
        .getImmutable()
        .update("undoStack", (s) => s.butLast())
        .update("uidStack", (s) => s.push(uid)),
      drawState.width,
      drawState.height
    );
  }

  static pushStroke(drawState: DrawState, cid: cutImageData, points: Point[]) {
    const uid = getUid();
    const undo = drawState.getUndoStack();

    const pushedState = mergeUndo(
      drawState
        .getImmutable()
        .set("state", "drawing")
        .update("deleted", (d) => d.concat(undo))
        .set("undoStack", OrderedSet())
        .update("strokes", (s) => s.push({ uid, points }))
        .update("uidStack", (s) => s.push(uid))
    );

    let position = drawState.getPosition();
    position = updatePosition(position, cid, uid, drawState.width);

    return new DrawState(
      pushedState.set("position", position),
      drawState.width,
      drawState.height
    );
  }

  static eraseStrokes(drawState: DrawState, cid: cutImageData) {
    const position = drawState.getPosition();
    if (!position) {
      return drawState;
    }

    const uid = getUid();
    const erased = getErasedStrokes(position, cid, drawState.width);

    return new DrawState(
      mergeUndo(
        drawState
          .getImmutable()
          .update("eraseStack", (s) => s.push({ uid, erased }))
          .update("uidStack", (s) => s.push(uid))
      ),
      drawState.width,
      drawState.height
    );
  }
}

function mergeUndo(drawStateRecord: DrawStateRecord) {
  const undo = drawStateRecord.get("undoStack");
  return drawStateRecord
    .update("deleted", (d) => d.concat(undo))
    .set("undoStack", OrderedSet())
    .update("uidStack", (s) => s.filter((uid) => !undo.has(uid)));
}

type cutImageData = {
  imageData: ImageData;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function updatePosition(
  position: List<Set<string>>,
  cid: cutImageData,
  uid: string,
  fullWidth: number
) {
  const {
    imageData: { data: buffer, width, height },
    minX,
    minY,
  } = cid;
  const data = new Array(width * height);

  for (let i = 0; i < buffer.length; i += 4) {
    data[i / 4] = Boolean(
      buffer[i] + buffer[i + 1] + buffer[i + 2] + buffer[i + 3]
    );
  }

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const i = r * width + c;
      const ii = (r + minY) * fullWidth + c + minX;
      if (data[i]) {
        position = position.update(ii, Set(), (s) => (s || Set()).add(uid));
      }
    }
  }

  return position;
}

function getErasedStrokes(
  position: List<Set<string>>,
  cid: cutImageData,
  fullWidth: number
) {
  const {
    imageData: { data: buffer, width, height },
    minX,
    minY,
  } = cid;
  let erased = Set<string>();
  const data = new Array(width * height);

  for (let i = 0; i < buffer.length; i += 4) {
    data[i / 4] = Boolean(
      buffer[i] + buffer[i + 1] + buffer[i + 2] + buffer[i + 3]
    );
  }

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const i = r * width + c;
      const ii = (r + minY) * fullWidth + c + minX;
      if (data[i]) {
        erased = erased.concat(position.get(ii) || Set());
      }
    }
  }
  return erased;
}

export type SetDrawState = Dispatch<SetStateAction<DrawState>>;

export type DrawStateMethod = (
  drawState: DrawState,
  cid: cutImageData,
  points: Point[]
) => DrawState;
