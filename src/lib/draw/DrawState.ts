import { List, OrderedSet, Record, Set } from "immutable";
import { Dispatch, SetStateAction } from "react";
import { Point } from "./draw";
import { v4 as getUid } from "uuid";

export interface Stroke {
  uid: string;
  points: Point[];
}

interface DrawStateRecordType {
  state: "drawing" | "revoking";
  strokes: List<Stroke>;
  uidStack: List<string>;
  undoStack: OrderedSet<string>;
  eraseStack: List<{
    uid: string;
    erased: Set<string>;
  }>;
  deleted: Set<string>;
  position: List<Set<string>>;
}

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



export interface FlatState {
  strokes: Stroke[];
  position?: string[][];
}

export const defaultFlatState: FlatState = {
  strokes: [],
  position: []
}

export class DrawState {
  constructor(
    private immutable: DrawStateRecord,
    public readonly width: number,
    public readonly height: number
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

  getLastStroke() {
    return this.getImmutable().get('strokes').last();
  }

  static createEmpty(width: number, height: number) {
    return new DrawState(defaultFactory(), width, height);
  }

  static createFromStored() {}

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

  static pushStroke(
    drawState: DrawState,
    imageData: ImageData,
    points: Point[]
  ) {
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
    position = updatePosition(position, imageData, uid);

    return new DrawState(
      pushedState.set("position", position),
      drawState.width,
      drawState.height
    );
  }

  static simplePush(
    drawState: DrawState,
    stroke: Stroke,
  ) {
    return new DrawState(
      drawState.getImmutable()
        .update('strokes', s => s.push(stroke)),
      drawState.width,
      drawState.height
    )
  }

  static eraseStrokes(drawState: DrawState, imageData: ImageData) {
    const position = drawState.getPosition();
    if (!position) {
      return drawState;
    }

    const uid = getUid();
    const erased = getErasedStrokes(position, imageData);

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

  static flaten(drawState: DrawState): FlatState {
    const mergedRecord = mergeUndo(drawState.getImmutable());
    const deleted = mergedRecord.get("deleted");
    const erased = drawState.getValidEraseStack().reduce((prev, e) => {
      return prev.concat(e.erased);
    }, Set<string>());

    const deletedAll = deleted.concat(erased);
    const strokes = mergedRecord
      .get("strokes")
      .filter((s) => !deletedAll.has(s.uid))
      .toArray();
    const position = mergedRecord
      .get("position")
      .map((set) => (!set ? set : set.toArray()))
      .toArray();
    return { strokes, position };
  }

  static loadFromFlat(
    { strokes, position }: FlatState,
    width: number,
    height: number
  ): DrawState {
    return new DrawState(
      defaultFactory()
        .set("strokes", List(strokes))
        .set("position", List(position?.map((arr) => (!arr ? arr : Set(arr))))),
      width,
      height
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

function updatePosition(
  position: List<Set<string>>,
  { data }: ImageData,
  uid: string
) {
  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    if (data[i + 3]) {
      position = position.update(i / 4, Set(), (s) => (s ?? Set()).add(uid));
    }
  }
  return position;
}

function getErasedStrokes(position: List<Set<string>>, { data }: ImageData) {
  let erased = Set<string>();

  const len = data.length;
  for (let i = 0; i < len; i += 4) {
    if (data[i + 3]) {
      erased = erased.concat(position.get(i / 4) ?? Set());
    }
  }

  return erased;
}

export type SetDrawState = Dispatch<SetStateAction<DrawState>>;

export type DrawStateMethod = (
  drawState: DrawState,
  imageData: ImageData,
  points: Point[]
) => DrawState;
