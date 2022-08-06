import { List, Record, OrderedMap, Map } from "immutable";
import { NIL, v4, v5, validate } from "uuid";
import Heap from "heap";

export const WIDTH = 2000;

export interface Stroke {
  uid: string;
  pathData: string;
  timestamp: number;
}

export type StrokeRecord = globalThis.Record<string, Stroke>;
export type Mutation = [string, string];
export type Splitter = [string, string[]];

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
      type: "split";
      splitters: Splitter[];
    }
  | {
      type: "undo";
    }
  | {
      type: "redo";
    };

interface DrawStateRecordType {
  strokes: OrderedMap<string, Stroke>;
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

  getStrokeMap() {
    return this.getImmutable().get("strokes");
  }

  getStrokeList(): Stroke[] {
    return this.getStrokeMap()
      .toArray()
      .map(([_, stroke]) => stroke);
  }

  getLastStroke() {
    return this.getStrokeMap().last();
  }

  isEmpty() {
    return this.getStrokeMap().size === 0;
  }

  hasStroke(uid: string) {
    return this.getStrokeMap().has(uid);
  }

  static createEmpty(ratio: number, width = WIDTH) {
    return new DrawState(defaultFactory(), width, width * ratio);
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
    const uid = v4();
    const timestamp = Date.now();
    const stroke = { pathData, uid, timestamp };
    return DrawState.pushStroke(drawState, stroke);
  }

  static addStrokes(
    drawState: DrawState,
    pathDataList: string[],
    IDs?: string[]
  ) {
    return DrawState.mutateStrokes(
      drawState,
      pathDataList.map((pathData) => {
        const uid = v4();
        IDs?.push(uid);
        return [uid, pathData];
      })
    );
  }

  static pushStroke(drawState: DrawState, stroke: Stroke) {
    const { uid } = stroke;
    const prevRecord = drawState.getImmutable();
    const currRecord = prevRecord
      .update("strokes", (s) => s.set(uid, stroke))
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

  static mutateStrokes(drawState: DrawState, mutations: Mutation[]) {
    if (mutations.length === 0) return drawState;
    const prevRecord = drawState.getImmutable();
    let strokes = drawState.getStrokeMap();
    mutations.forEach(
      ([uid, pathData]) =>
        (strokes = strokes.update(
          uid,
          { uid, pathData, timestamp: Date.now() },
          (s) => ({ ...s, pathData })
        ))
    );
    const currRecord = prevRecord
      .set("strokes", strokes)
      .update("historyStack", (s) => s.push(prevRecord))
      .delete("undoStack");

    const lastOp: Operation = { type: "mutate", mutations };

    return new DrawState(currRecord, drawState.width, drawState.height, lastOp);
  }

  static splitStrokes(drawState: DrawState, splitters: Splitter[]) {
    if (splitters.length === 0) return drawState;
    const splitMap = Map(splitters);
    let strokes = OrderedMap<string, Stroke>();
    const prevStrokes = drawState.getStrokeMap();
    prevStrokes.forEach((stroke, prevUid) => {
      const splitStrokes = splitMap.get(prevUid);
      if (splitStrokes) {
        strokes = strokes.merge(
          splitStrokes.map((pathData, index) => {
            // update legacy uid solution.
            if (!validate(prevUid)) prevUid = v5(prevUid, NIL);

            const uid = v5(String(index), prevUid);
            const { timestamp } = stroke;
            return [uid, { pathData, timestamp, uid }];
          })
        );
      } else {
        strokes = strokes.set(prevUid, stroke);
      }
    });
    const prevRecord = drawState.getImmutable();
    const currRecord = prevRecord
      .set("strokes", strokes)
      .update("historyStack", (s) => s.push(prevRecord));
    const lastOp: Operation = { type: "split", splitters };
    return new DrawState(currRecord, drawState.width, drawState.height, lastOp);
  }

  // sync with mutation.
  static syncStrokeTime(drawState: DrawState, stroke: Stroke) {
    const { uid, timestamp } = stroke;
    const prevStroke = drawState.getStrokeMap().get(uid);
    if (!prevStroke) return;
    prevStroke.timestamp = timestamp;
  }

  static pushOperation(drawState: DrawState, op: Operation) {
    switch (op.type) {
      case "add":
        return DrawState.pushStroke(drawState, op.stroke);
      case "erase":
        return DrawState.eraseStrokes(drawState, op.erased);
      case "mutate":
        return DrawState.mutateStrokes(drawState, op.mutations);
      case "undo":
        return DrawState.undo(drawState);
      case "redo":
        return DrawState.redo(drawState);
      case "split":
        return DrawState.splitStrokes(drawState, op.splitters);
    }
  }

  static flaten(drawState: DrawState): FlatState {
    const strokes = drawState.getImmutable().get("strokes").toObject();
    return { strokes };
  }

  static loadFromFlat(
    flatState: FlatState,
    ratio: number,
    width = WIDTH
  ): DrawState {
    const { strokes, operations } = flatState;
    let ds = new DrawState(
      defaultFactory().set("strokes", OrderedMap(strokes)),
      width,
      width * ratio
    );
    operations?.forEach((op) => (ds = DrawState.pushOperation(ds, op)));
    return ds;
  }

  static mergeStates(...states: DrawState[]): Stroke[] {
    const iterators = states.map((ds) => ds.getStrokeMap().values());
    const mergedStrokes = [];
    const heap = new Heap<[Stroke, number]>(
      ([s0], [s1]) => s0.timestamp - s1.timestamp
    );

    iterators.forEach((iter, index) => {
      const { value, done } = iter.next();
      done || heap.push([value, index]);
    });

    while (heap.size() > 0) {
      const record = heap.pop();
      if (!record) break;
      const [stroke, index] = record;
      mergedStrokes.push(stroke);

      const iterator = iterators[index];
      if (!iterator) break;
      const { value, done } = iterator.next();
      done || heap.push([value, index]);
    }
    return mergedStrokes;
  }
}
