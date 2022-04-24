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

  getOneState(pageID: string, userID: string) {
    return this.getPageStates().get(pageID)?.get(userID);
  }

  getOnePageState(pageID: string) {
    return this.getPageStates().get(pageID);
  }

  getPageRatio(pageID: string) {
    return this.getPageInfos().get(pageID)?.ratio;
  }

  includesPage(pageID: string) {
    return this.getPageStates().has(pageID);
  }

  setState(pageID: string, userID: string, drawState: DrawState) {
    const pageMap = this.getPageStates().get(pageID);
    if (!pageMap) return this;
    return new TeamState(
      this.getImmutable().update("pageStates", (m) =>
        m.set(pageID, pageMap.set(userID, drawState))
      )
    );
  }

  static createFromTeamPages(teamNote: TeamNote, width: number) {
    const { pageRec } = teamNote;
    let record = defaultFactory();
    Object.entries(pageRec).forEach(([pageID, teamPage]) => {
      const { states, ratio } = teamPage;
      const pageMap = Map(
        Object.entries(states).map(([userID, flatState]) => [
          userID,
          DrawState.loadFromFlat(flatState, width, width * ratio),
        ])
      );
      record = record
        .update("pageStates", (m) => m.set(pageID, pageMap))
        .update("pageInfos", (m) => m.set(pageID, { ratio }));
    });
    return new TeamState(record);
  }

  addPage(pageID: string, notePage: NotePage) {
    const { ratio } = notePage;
    return new TeamState(
      this.getImmutable()
        .update("pageStates", (m) => m.set(pageID, Map()))
        .update("pageInfos", (m) => m.set(pageID, { ratio }))
    );
  }

  pushOperation(setOp: SetOperation, userID: string, width: number) {
    const { pageID, ...op } = setOp;
    const ratio = this.getPageRatio(pageID);
    if (!this.includesPage(pageID) || !ratio) return this;
    const prevDs =
      this.getOneState(pageID, userID) ||
      DrawState.createEmpty(width, width * ratio);

    const ds = DrawState.pushOperation(prevDs, op);
    return this.setState(pageID, userID, ds);
  }
}
