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

  getEditStack() {
    return this.getImmutable().get("editStack");
  }

  getUndoStack() {
    return this.getImmutable().get("undoStack");
  }

  setState(pageId: string, drawState: DrawState) {
    let newImmu = this.getImmutable().update("states", (s) =>
      s.set(pageId, drawState)
    );

    if (this.getStates().has(pageId)) {
      newImmu = newImmu.update("editStack", (s) => s.push(pageId));
    }

    let lastOp: SetOperation | undefined;
    if (drawState.lastOp) {
      lastOp = { ...drawState.lastOp, pageId };
    }
    return new StateSet(newImmu, lastOp);
  }

  addState(pageId: string, notePage: NotePage, width: number) {
    const { state, ratio } = notePage;
    const newImmu = this.getImmutable().update("states", (s) =>
      s.set(pageId, DrawState.loadFromFlat(state, width, width * ratio))
    );
    return new StateSet(newImmu);
  }

  deleteState(pageId: string) {
    return new StateSet(
      this.getImmutable().update('states', s => s.delete(pageId))
    )
  }

  getOneState(pageId: string) {
    return this.getImmutable().get("states").get(pageId);
  }

  isUndoable() {
    return this.getEditStack().size > 0;
  }

  isRedoable() {
    return this.getUndoStack().size > 0;
  }

  undo() {
    if (!this.isUndoable()) return this;
    const immu = this.getImmutable();
    const lastUid = immu.get("editStack").last();
    if (!lastUid) return this;
    const prevDS = immu.get("states").get(lastUid);
    if (!prevDS) return this;

    const newDS = DrawState.undo(prevDS);
    const lastOp = newDS.lastOp;
    let lastSetOp: SetOperation | undefined;
    if (lastOp) lastSetOp = { pageId: lastUid, ...lastOp };

    return new StateSet(
      immu
        .update("editStack", (s) => s.pop())
        .update("undoStack", (s) => s.push(lastUid))
        .update("states", (s) => s.set(lastUid, newDS)),
      lastSetOp
    );
  }

  redo() {
    if (!this.isRedoable()) return this;
    const immu = this.getImmutable();
    const lastUid = immu.get("undoStack").last();
    if (!lastUid) return this;
    const prevDS = immu.get("states").get(lastUid);
    if (!prevDS) return this;

    const newDS = DrawState.redo(prevDS);
    const lastOp = newDS.lastOp;
    let lastSetOp: SetOperation | undefined;
    if (lastOp) lastSetOp = { pageId: lastUid, ...lastOp };

    return new StateSet(
      immu
        .update("undoStack", (s) => s.pop())
        .update("editStack", (s) => s.push(lastUid))
        .update("states", (s) => s.set(lastUid, newDS)),
      lastSetOp
    );
  }

  pushOperation(SetOp: SetOperation) {
    const { type, pageId } = SetOp;
    const prevDs = this.getImmutable().get("states").get(pageId);
    if (!prevDs) return this;

    let ds: DrawState;
    switch (type) {
      case "add":
        ds = DrawState.pushStroke(prevDs, SetOp.stroke);
        break;
      case "erase":
        ds = DrawState.pushErase(prevDs, SetOp.erase);
        break;
      case "undo":
        ds = DrawState.pushUndo(prevDs, SetOp.undoUid);
        break;
      case "redo":
        ds = DrawState.pushRedo(prevDs, SetOp.redoUid);
        break;
    }
    return this.setState(pageId, ds);
  }

  getLastDs(): [string, DrawState] {
    const pageId = this.lastOp?.pageId;
    if (!pageId) throw new Error("can't get last modified page.");
    const ds = this.getOneState(pageId);
    if (!ds) throw new Error("can't get last modified page drawstate.");
    return [pageId, ds];
  }
}
