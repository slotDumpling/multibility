import { Map, Record } from "immutable";
import { NotePage, TeamNote, TeamPageInfo } from "../note/note";
import { DrawState } from "./DrawState";
import { SetOperation } from "./StateSet";

interface TeamStateRecordType {
  pageStates: Map<string, Map<string, DrawState>>;
  pageInfos: Map<string, TeamPageInfo>;
}

const defaultRecord: Readonly<TeamStateRecordType> = {
  pageStates: Map(),
  pageInfos: Map(),
};

type TeamStateRecord = Record<TeamStateRecordType>;
const defaultFactory = Record(defaultRecord);

export class TeamState {
  constructor(private immutable: TeamStateRecord) {}

  getImmutable() {
    return this.immutable;
  }

  getPageStates() {
    return this.getImmutable().get("pageStates");
  }

  getPageInfos() {
    return this.getImmutable().get("pageInfos");
  }

  getOneState(pageId: string, userId: string) {
    return this.getPageStates().get(pageId)?.get(userId);
  }

  getOnePageState(pageId: string) {
    return this.getPageStates().get(pageId);
  }

  getPageRatio(pageId: string) {
    return this.getPageInfos().get(pageId)?.ratio;
  }

  includesPage(pageId: string) {
    return this.getPageStates().has(pageId);
  }

  setState(pageId: string, userId: string, drawState: DrawState) {
    const pageMap = this.getPageStates().get(pageId);
    if (!pageMap) return this;
    return new TeamState(
      this.getImmutable().update("pageStates", (m) =>
        m.set(pageId, pageMap.set(userId, drawState))
      )
    );
  }

  static createFromTeamPages(teamNote: TeamNote, width: number) {
    const { pageRec } = teamNote;
    let record = defaultFactory();
    Object.entries(pageRec).forEach(([pageId, teamPage]) => {
      const { states, ratio } = teamPage;
      const pageMap = Map(
        Object.entries(states).map(([userId, strokes]) => [
          userId,
          DrawState.loadFromFlat({ strokes }, width, width * ratio),
        ])
      );
      record = record
        .update("pageStates", (m) => m.set(pageId, pageMap))
        .update("pageInfos", (m) => m.set(pageId, { ratio }));
    });
    return new TeamState(record);
  }

  addPage(pageId: string, notePage: NotePage) {
    const { ratio } = notePage;
    return new TeamState(
      this.getImmutable()
        .update("pageStates", (m) => m.set(pageId, Map()))
        .update("pageInfos", (m) => m.set(pageId, { ratio }))
    );
  }

  pushOperation(setOp: SetOperation, userId: string, width: number) {
    const { type, pageId } = setOp;
    const ratio = this.getPageRatio(pageId);
    if (!this.includesPage(pageId) || !ratio) return this;
    const prevDs =
      this.getOneState(pageId, userId) ||
      DrawState.createEmpty(width, width * ratio);

    let ds: DrawState;
    switch (type) {
      case "add":
        ds = DrawState.pushStroke(prevDs, setOp.stroke);
        break;
      case "erase":
        ds = DrawState.eraseStrokes(prevDs, setOp.erased);
        break;
      case "mutate":
        ds = DrawState.mutateStroke(prevDs, setOp.mutations);
        break;
      case "undo":
        ds = DrawState.undo(prevDs);
        break;
      case "redo":
        ds = DrawState.redo(prevDs);
        break;
    }
    return this.setState(pageId, userId, ds);
  }
}
