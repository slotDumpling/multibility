import { DrawState, Operation } from "./DrawState";
import { List, Map, Record } from "immutable";
import { NotePage } from "lib/note/note";

interface StateSetRecordType {
  states: Map<string, DrawState>;
  editStack: List<string>;
  undoStack: List<string>;
}

const defaultRecord: Readonly<StateSetRecordType> = {
  states: Map(),
  editStack: List(),
  undoStack: List(),
};

type StateSetRecord = Record<StateSetRecordType>;
const defaultFactory = Record(defaultRecord);

export type SetOperation = Operation & { pageID: string };

export class StateSet {
  constructor(
    private immutable: StateSetRecord,
    public lastOp?: SetOperation
  ) {}

  static createFromPages(pageRec: globalThis.Record<string, NotePage>) {
    return new StateSet(
      defaultFactory().set(
        "states",
        Map(pageRec).map(({ state, ratio }) =>
          DrawState.loadFromFlat(state, ratio)
        )
      )
    );
  }

  getImmutable() {
    return this.immutable;
  }

  getStates() {
    return this.getImmutable().get("states");
  }

  getOneState(pageID: string) {
    return this.getStates().get(pageID);
  }

  getEditStack() {
    return this.getImmutable().get("editStack");
  }

  getUndoStack() {
    return this.getImmutable().get("undoStack");
  }

  setState(pageID: string, drawState: DrawState) {
    const prevDS = this.getOneState(pageID);
    if (!prevDS || prevDS === drawState) return this;
    let currRecord = this.getImmutable()
      .update("states", (s) => s.set(pageID, drawState))
      .update("editStack", (l) => l.push(pageID))
      .delete("undoStack");

    const { lastOp } = drawState;
    const lastSetOp = lastOp && { ...lastOp, pageID };

    return new StateSet(currRecord, lastSetOp);
  }

  // sync with mutation.
  syncStrokeTime(pageID: string, uid: string, timestamp: number) {
    const prevDS = this.getOneState(pageID);
    prevDS && DrawState.syncStrokeTime(prevDS, uid, timestamp);
    return this;
  }

  addState(pageID: string, notePage: NotePage) {
    const { state, ratio } = notePage;
    const newDS = DrawState.loadFromFlat(state, ratio);
    const currRecord = this.getImmutable().update("states", (s) =>
      s.set(pageID, newDS)
    );
    return new StateSet(currRecord);
  }

  deleteState(pageID: string) {
    return new StateSet(
      this.getImmutable().update("states", (s) => s.delete(pageID))
    );
  }

  isUndoable() {
    return this.getEditStack().size > 0;
  }

  isRedoable() {
    return this.getUndoStack().size > 0;
  }

  undo() {
    if (!this.isUndoable()) return this;
    const lastUid = this.getEditStack().last();
    const prevDS = lastUid && this.getOneState(lastUid);
    if (!prevDS) return this;

    const newDS = DrawState.undo(prevDS);
    const { lastOp } = newDS;
    const lastSetOp = lastOp && { pageID: lastUid, ...lastOp };

    return new StateSet(
      this.getImmutable()
        .update("editStack", (s) => s.pop())
        .update("undoStack", (s) => s.push(lastUid))
        .update("states", (s) => s.set(lastUid, newDS)),
      lastSetOp
    );
  }

  redo() {
    if (!this.isRedoable()) return this;
    const lastUid = this.getUndoStack().last();
    const prevDS = lastUid && this.getOneState(lastUid);
    if (!prevDS) return this;

    const newDS = DrawState.redo(prevDS);
    const { lastOp } = newDS;
    const lastSetOp = lastOp && { pageID: lastUid, ...lastOp };

    return new StateSet(
      this.getImmutable()
        .update("undoStack", (s) => s.pop())
        .update("editStack", (s) => s.push(lastUid))
        .update("states", (s) => s.set(lastUid, newDS)),
      lastSetOp
    );
  }
}
