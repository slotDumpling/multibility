import { List, OrderedSet, Record, Set } from "immutable";
import { Dispatch, SetStateAction } from "react";
import { v4 as getUid } from "uuid";

export interface Stroke {
  uid: string;
  pathData: string;
}

interface Erase {
  uid: string;
  erased: string[];
}

interface ImmuErase {
  uid: string;
  erased: Set<string>;
}

export type Operation =
  | {
      type: "add";
      stroke: Stroke;
    }
  | {
      type: "erase";
      erase: Erase;
    }
  | {
      type: "undo";
      undoUid: string;
    }
  | {
      type: "redo";
      redoUid: string;
    };

interface DrawStateRecordType {
  state: "drawing" | "revoking";
  strokes: List<Stroke>;
  uidStack: List<string>;
  undoStack: OrderedSet<string>;
  eraseStack: List<ImmuErase>;
  deleted: Set<string>;
}

type DrawStateRecord = Record<DrawStateRecordType>;

const defaultRecord: Readonly<DrawStateRecordType> = {
  state: "drawing",
  strokes: List(),
  uidStack: List(),
  undoStack: OrderedSet(),
  eraseStack: List(),
  deleted: Set(),
};

const defaultFactory = Record(defaultRecord);

export interface FlatState {
  strokes: Stroke[];
}

export const getDefaultFlatState = () => {
  return { strokes: [] } as FlatState;
};

export class DrawState {
  constructor(
    private immutable: DrawStateRecord,
    public readonly width: number,
    public readonly height: number,
    public lastOp?: Operation
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

  getLastStroke() {
    return this.getImmutable().get("strokes").last();
  }

  isEmpty() {
    return this.getStrokes().size === 0;
  }

  static createEmpty(width: number, height: number) {
    return new DrawState(defaultFactory(), width, height);
  }

  static undo(drawState: DrawState) {
    const uid = drawState.getUidStack().last();

    if (!uid) return drawState;

    const lastOp: Operation = { type: "undo", undoUid: uid };

    return new DrawState(
      drawState
        .getImmutable()
        .set("state", "revoking")
        .update("undoStack", (s) => s.add(uid))
        .update("uidStack", (s) => s.pop()),
      drawState.width,
      drawState.height,
      lastOp
    );
  }

  static redo(drawState: DrawState) {
    const undo = drawState.getUndoStack();
    const uid = undo.last();
    if (!uid) return drawState;

    const lastOp: Operation = { type: "redo", redoUid: uid };

    return new DrawState(
      drawState
        .getImmutable()
        .update("undoStack", (s) => s.butLast())
        .update("uidStack", (s) => s.push(uid)),
      drawState.width,
      drawState.height,
      lastOp
    );
  }

  static addStroke(drawState: DrawState, newStroke: Omit<Stroke, "uid">) {
    const uid = getUid();
    const stroke = { ...newStroke, uid };
    return DrawState.pushStroke(drawState, stroke);
  }

  static pushStroke(drawState: DrawState, stroke: Stroke) {
    const undo = drawState.getUndoStack();
    const pushedState = mergeUndo(
      drawState
        .getImmutable()
        .set("state", "drawing")
        .update("deleted", (d) => d.concat(undo))
        .set("undoStack", OrderedSet())
        .update("strokes", (s) => s.push(stroke))
        .update("uidStack", (s) => s.push(stroke.uid))
    );

    const lastOp: Operation = { type: "add", stroke };

    return new DrawState(
      pushedState,
      drawState.width,
      drawState.height,
      lastOp
    );
  }

  static eraseStrokes(drawState: DrawState, erased: string[]) {
    const erase = { uid: getUid(), erased };
    return DrawState.pushErase(drawState, erase);
  }

  static pushErase(drawState: DrawState, erase: Erase) {
    const { uid, erased } = erase;
    const immuErase: ImmuErase = { uid, erased: Set(erased) };

    const lastOp: Operation = { type: "erase", erase };

    return new DrawState(
      drawState
        .getImmutable()
        .update("eraseStack", (s) => s.push(immuErase))
        .update("uidStack", (s) => s.push(uid)),
      drawState.width,
      drawState.height,
      lastOp
    );
  }

  static pushUndo(drawState: DrawState, undoUid: string) {
    return new DrawState(
      drawState.getImmutable().update("undoStack", (s) => s.add(undoUid)),
      drawState.width,
      drawState.height
    );
  }

  static pushRedo(drawState: DrawState, RedoUid: string) {
    return new DrawState(
      drawState.getImmutable().update("undoStack", (s) => s.delete(RedoUid)),
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
    return { strokes };
  }

  static loadFromFlat(
    { strokes }: FlatState,
    width: number,
    height: number
  ): DrawState {
    return new DrawState(
      defaultFactory().set("strokes", List(strokes)),
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

export type SetDrawState = Dispatch<SetStateAction<DrawState>>;
