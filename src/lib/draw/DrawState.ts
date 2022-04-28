import { List, Record, OrderedMap } from "immutable";
import { v4 as getUid } from "uuid";

export const WIDTH = 2000;

export interface Stroke {
  uid: string;
  pathData: string;
}

export type StrokeRecord = globalThis.Record<string, string>;
export type Mutation = [string, string];

export type Operation =
  | {
      type: "add";
      stroke: Stroke;
    }
  | {
      type: "erase";
      erased: string[];
    }
  | {
      type: "mutate";
      mutations: Mutation[];
    }
  | {
      type: "undo";
    }
  | {
      type: "redo";
    };

interface DrawStateRecordType {
  strokes: OrderedMap<string, string>;
  undoStack: List<DrawStateRecord>;
  historyStack: List<DrawStateRecord>;
}

type DrawStateRecord = Record<DrawStateRecordType>;

const defaultRecord: Readonly<DrawStateRecordType> = {
  strokes: OrderedMap(),
  undoStack: List(),
  historyStack: List(),
};

const defaultFactory = Record(defaultRecord);

export interface FlatState {
  strokes: StrokeRecord;
  operations?: Operation[];
}

export const getDefaultFlatState = (): FlatState => {
  return { strokes: {} };
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

  getUndoStack() {
    return this.getImmutable().get("undoStack");
  }

  getHistoryStack() {
    return this.getImmutable().get("historyStack");
  }

  getStrokesMap() {
    return this.getImmutable().get("strokes");
  }

  getValidStrokes(): Stroke[] {
    return this.getStrokesMap()
      .toArray()
      .map(([uid, pathData]) => ({ uid, pathData }));
  }

  isEmpty() {
    return this.getStrokesMap().size === 0;
  }

  static createEmpty(width: number, height: number) {
    return new DrawState(defaultFactory(), width, height);
  }

  static undo(drawState: DrawState) {
    const lastOp: Operation = { type: "undo" };
    const lastRecord = drawState.getHistoryStack().last();
    if (!lastRecord) return drawState;
    const undoStack = drawState
      .getUndoStack()
      .unshift(drawState.getImmutable());
    return new DrawState(
      lastRecord.set("undoStack", undoStack),
      drawState.width,
      drawState.height,
      lastOp
    );
  }

  static redo(drawState: DrawState) {
    const lastOp: Operation = { type: "redo" };

    const nextRecord = drawState.getUndoStack().first();
    if (!nextRecord) return drawState;
    return new DrawState(nextRecord, drawState.width, drawState.height, lastOp);
  }

  static addStroke(drawState: DrawState, pathData: string) {
    const uid = getUid();
    const stroke = { pathData, uid };
    return DrawState.pushStroke(drawState, stroke);
  }

  static pushStroke(drawState: DrawState, stroke: Stroke) {
    const { uid, pathData } = stroke;
    const prevRecord = drawState.getImmutable();
    const currRecord = prevRecord
      .update("strokes", (s) => s.set(uid, pathData))
      .update("historyStack", (s) => s.push(prevRecord))
      .delete("undoStack");

    const lastOp: Operation = { type: "add", stroke };

    return new DrawState(currRecord, drawState.width, drawState.height, lastOp);
  }

  static eraseStrokes(drawState: DrawState, erased: string[]) {
    if (erased.length === 0) return drawState;
    const prevRecord = drawState.getImmutable();
    const currRecord = prevRecord
      .update("strokes", (m) => m.deleteAll(erased))
      .update("historyStack", (s) => s.push(prevRecord))
      .delete("undoStack");

    const lastOp: Operation = { type: "erase", erased };

    return new DrawState(currRecord, drawState.width, drawState.height, lastOp);
  }

  static mutateStroke(drawState: DrawState, mutations: Mutation[]) {
    if (mutations.length === 0) return drawState;
    const prevRecord = drawState.getImmutable();
    const currRecord = prevRecord
      .update("strokes", (m) => m.merge(mutations))
      .update("historyStack", (s) => s.push(prevRecord))
      .delete("undoStack");

    const lastOp: Operation = { type: "mutate", mutations };

    return new DrawState(currRecord, drawState.width, drawState.height, lastOp);
  }

  static pushOperation(drawState: DrawState, op: Operation) {
    switch (op.type) {
      case "add":
        return DrawState.pushStroke(drawState, op.stroke);
      case "erase":
        return DrawState.eraseStrokes(drawState, op.erased);
      case "mutate":
        return DrawState.mutateStroke(drawState, op.mutations);
      case "undo":
        return DrawState.undo(drawState);
      case "redo":
        return DrawState.redo(drawState);
    }
  }

  static flaten(drawState: DrawState): FlatState {
    const strokes = drawState.getImmutable().get("strokes").toObject();
    return { strokes };
  }

  static loadFromFlat(
    flatState: FlatState,
    width: number,
    height: number
  ): DrawState {
    const { strokes, operations } = flatState;
    let ds = new DrawState(
      defaultFactory().set("strokes", OrderedMap(strokes)),
      width,
      height
    );
    operations?.forEach((op) => (ds = DrawState.pushOperation(ds, op)));
    return ds;
  }
}
