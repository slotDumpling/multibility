import { List, Map, Record as Rec } from "immutable";
import { DrawState, Operation } from "./DrawState";
import { NotePage } from "../note/note";

interface StateSetRecordType {
  states: Map<string, DrawState>;
  editStack: List<string>;
  undoStack: List<string>;
}

export type SetOperation = Operation & { pageId: string };

type StateSetRecord = Rec<StateSetRecordType>;

const defaultRecord: Readonly<StateSetRecordType> = {
  states: Map(),
  editStack: List(),
  undoStack: List(),
};

const defaultFactory = Rec(defaultRecord);

export class StateSet {
  constructor(
    private immutable: StateSetRecord,
    public lastOp?: SetOperation
  ) {}

  static createFromList(list: [string, DrawState][]) {
    return new StateSet(defaultFactory().set("states", Map(list)));
  }

  static createFromPages(pageRec: Record<string, NotePage>, width: number) {
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
    if (!this.getOneState(pageId)) return this;
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

  pushOperation(SetOp: SetOperation) {
    const { type, pageId } = SetOp;
    const prevDs = this.getOneState(pageId);
    if (!prevDs) return this;

    let ds: DrawState;
    switch (type) {
      case "add":
        ds = DrawState.pushStroke(prevDs, SetOp.stroke);
        break;
      case "erase":
        ds = DrawState.eraseStrokes(prevDs, SetOp.erased);
        break;
      case "mutate":
        ds = DrawState.mutateStroke(prevDs, SetOp.mutations);
        break;
      case "undo":
        ds = DrawState.undo(prevDs);
        break;
      case "redo":
        ds = DrawState.redo(prevDs);
        break;
    }
    return this.setState(pageId, ds);
  }

  getLastDS(): [string, DrawState] | undefined {
    const pageId = this.lastOp?.pageId;
    const ds = pageId && this.getOneState(pageId);
    return ds ? [pageId, ds] : undefined;
  }
}
