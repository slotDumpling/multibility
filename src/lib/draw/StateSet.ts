import { List, Map, Record } from "immutable";
import { DrawState, Operation } from "./DrawState";
import { NotePage } from "../note/note";

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

export type SetOperation = Operation & { pageId: string };

export class StateSet {
  constructor(
    private immutable: StateSetRecord,
    public lastOp?: SetOperation
  ) {}

  static createFromList(list: [string, DrawState][]) {
    return new StateSet(defaultFactory().set("states", Map(list)));
  }

  static createFromPages(
    pageRec: globalThis.Record<string, NotePage>,
    width: number
  ) {
    const entries = Object.entries(pageRec);
    return StateSet.createFromList(
      entries.map(([key, { state, ratio }]) => [
        key,
        DrawState.loadFromFlat(state, width, width * ratio),
      ])
    );
  }

  getImmutable() {
    return this.immutable;
  }

  getStates() {
    return this.getImmutable().get("states");
  }

  getOneState(pageId: string) {
    return this.getStates().get(pageId);
  }

  getEditStack() {
    return this.getImmutable().get("editStack");
  }

  getUndoStack() {
    return this.getImmutable().get("undoStack");
  }

  setState(pageId: string, drawState: DrawState) {
    const prevDS = this.getOneState(pageId);
    if (!prevDS || prevDS === drawState) return this;
    let currRecord = this.getImmutable()
      .update("states", (s) => s.set(pageId, drawState))
      .update("editStack", (l) => l.push(pageId))
      .delete("undoStack");

    const { lastOp } = drawState;
    const lastSetOp = lastOp && { ...lastOp, pageId };

    return new StateSet(currRecord, lastSetOp);
  }

  addState(pageId: string, notePage: NotePage, width: number) {
    const { state, ratio } = notePage;
    const newDS = DrawState.loadFromFlat(state, width, width * ratio);
    const currRecord = this.getImmutable().update("states", (s) =>
      s.set(pageId, newDS)
    );
    return new StateSet(currRecord);
  }

  deleteState(pageId: string) {
    return new StateSet(
      this.getImmutable().update("states", (s) => s.delete(pageId))
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
    const lastSetOp = lastOp && { pageId: lastUid, ...lastOp };

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
    const lastSetOp = lastOp && { pageId: lastUid, ...lastOp };

    return new StateSet(
      this.getImmutable()
        .update("undoStack", (s) => s.pop())
        .update("editStack", (s) => s.push(lastUid))
        .update("states", (s) => s.set(lastUid, newDS)),
      lastSetOp
    );
  }

  getLastDS(): [string, DrawState] | undefined {
    const pageId = this.lastOp?.pageId;
    const ds = pageId && this.getOneState(pageId);
    return ds ? [pageId, ds] : undefined;
  }
}
