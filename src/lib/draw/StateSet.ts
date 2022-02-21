import { List, OrderedMap, Record as Rec } from "immutable";
import { NotePage } from "../note/note";
import { DrawState, Operation, Stroke } from "./DrawState";

interface StateSetRecordType {
  states: OrderedMap<string, DrawState>;
  keys: List<string>;
  editStack: List<string>;
  undoStack: List<string>;
}

export type SetOperation = Operation & { pageId: string };

type StateSetRecord = Rec<StateSetRecordType>;

const defaultRecord: Readonly<StateSetRecordType> = {
  states: OrderedMap(),
  keys: List(),
  editStack: List(),
  undoStack: List(),
};

const defaultFactory = Rec(defaultRecord);

export class StateSet {
  constructor(
    private immutable: StateSetRecord,
    public lastOp?: SetOperation
  ) {}

  static createEmpty() {
    return new StateSet(defaultFactory());
  }

  static createKeyed(keys: string[]) {
    return new StateSet(defaultFactory().set("keys", List(keys)));
  }

  static createFromList(list: [string, DrawState][]) {
    return new StateSet(
      defaultFactory()
        .set("keys", List(list.map((item) => item[0])))
        .set("states", OrderedMap(list))
    );
  }

  static createFromPages(pageRecord: Record<string, NotePage>, width: number) {
    const entries = Object.entries(pageRecord);
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

  getKeys() {
    return this.getImmutable().get("keys");
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
    const lastUid = this.getImmutable().get("editStack").last();
    if (!lastUid) return this;

    const prevDS = this.getImmutable().get("states").get(lastUid);
    if (!prevDS) return this;

    const newDS = DrawState.undo(prevDS);
    const lastOp = newDS.lastOp;
    let lastSetOp: SetOperation | undefined;
    if (lastOp) lastSetOp = { pageId: lastUid, ...lastOp };

    return new StateSet(
      this.getImmutable()
        .update("editStack", (s) => s.pop())
        .update("undoStack", (s) => s.push(lastUid))
        .update("states", (s) => s.set(lastUid, newDS)),
      lastSetOp
    );
  }

  redo() {
    if (this.isRedoable()) {
      const lastUid = this.getImmutable().get("undoStack").last();
      if (!lastUid) return this;

      const prevDS = this.getImmutable().get("states").get(lastUid);
      if (!prevDS) return this;

      const newDS = DrawState.redo(prevDS);
      const lastOp = newDS.lastOp;
      let lastSetOp: SetOperation | undefined;
      if (lastOp) lastSetOp = { pageId: lastUid, ...lastOp };

      return new StateSet(
        this.getImmutable()
          .update("undoStack", (s) => s.pop())
          .update("editStack", (s) => s.push(lastUid))
          .update("states", (s) => s.set(lastUid, newDS)),
        lastSetOp
      );
    } else {
      return this;
    }
  }

  pushStroke(pageId: string, stroke: Stroke) {
    const prevDs = this.getImmutable().get("states").get(pageId);
    if (!prevDs) return this;
    const ds = DrawState.pushStroke(prevDs, stroke);
    return this.setState(pageId, ds);
  }

  pushOperation(SetOp: SetOperation) {
    const { type, pageId } = SetOp;
    const prevDs = this.getImmutable().get("states").get(pageId);
    if (!prevDs) return this;

    let ds: DrawState;
    switch (type) {
      case 'add':
        ds = DrawState.pushStroke(prevDs, SetOp.stroke);
        break;
      case 'erase':
        ds = DrawState.pushErase(prevDs, SetOp.erase);
        break;
      case 'undo':
        ds = DrawState.pushUndo(prevDs, SetOp.undoUid);
        break;
      case 'redo':
        ds = DrawState.pushRedo(prevDs, SetOp.redoUid);
        break;
    }

    return this.setState(pageId, ds);
  }
}
