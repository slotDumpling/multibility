import { List, OrderedMap, Record as Rec } from "immutable";
import { NotePage } from "../note/note";
import { DrawState, Stroke } from "./DrawState";

interface StateSetRecordType {
  states: OrderedMap<string, DrawState>;
  keys: List<string>;
  editStack: List<string>;
  undoStack: List<string>;
}

type StateSetRecord = Rec<StateSetRecordType>;

const defaultRecord: Readonly<StateSetRecordType> = {
  states: OrderedMap(),
  keys: List(),
  editStack: List(),
  undoStack: List(),
};

const defaultFactory = Rec(defaultRecord);

export class StateSet {
  constructor(private immutable: StateSetRecord) {}

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

  setState(uid: string, drawState: DrawState) {
    let newImmu = this.getImmutable().update("states", (s) =>
      s.set(uid, drawState)
    );

    if (this.getStates().has(uid)) {
      newImmu = newImmu.update("editStack", (s) => s.push(uid));
    }
    return new StateSet(newImmu);
  }

  getOneState(uid: string) {
    return this.getImmutable().get("states").get(uid);
  }

  isUndoable() {
    return this.getEditStack().size > 0;
  }

  isRedoable() {
    return this.getUndoStack().size > 0;
  }

  undo() {
    if (this.isUndoable()) {
      const lastUid = this.getImmutable().get("editStack").last();
      if (!lastUid) return this;
      return new StateSet(
        this.getImmutable()
          .update("states", (s) =>
            s.update(lastUid, (state) => {
              if (!state) throw new Error("undo wrong uid");
              return DrawState.undo(state);
            })
          )
          .update("editStack", (s) => s.pop())
          .update("undoStack", (s) => s.push(lastUid))
      );
    } else {
      return this;
    }
  }

  redo() {
    if (this.isRedoable()) {
      const lastUid = this.getImmutable().get("undoStack").last();
      if (!lastUid) return this;
      return new StateSet(
        this.getImmutable()
          .update("states", (s) =>
            s.update(lastUid, (state) => {
              if (!state) throw new Error("redo wrong uid");
              return DrawState.redo(state);
            })
          )
          .update("undoStack", (s) => s.pop())
          .update("editStack", (s) => s.push(lastUid))
      );
    } else {
      return this;
    }
  }

  pushStroke(uid: string, stroke: Stroke) {
    const prevDs = this.getImmutable().get("states").get(uid);
    if (!prevDs) return this;
    const ds = DrawState.simplePush(prevDs, stroke);
    return this.setState(uid, ds);
  }
}
