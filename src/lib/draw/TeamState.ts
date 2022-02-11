import { List, OrderedMap, Record } from "immutable";
import { DrawState, Stroke } from "./DrawState";

interface TeamStateSetRecordType {
  states: OrderedMap<string, DrawState>;
  keys: List<string>;
}

type TeamStateSetRecord = Record<TeamStateSetRecordType>;

const defaultRecord: Readonly<TeamStateSetRecordType> = {
  states: OrderedMap(),
  keys: List(),
};

const defaultFactory = Record(defaultRecord);

export class TeamStateSet {
  constructor(private immutable: TeamStateSetRecord) {}

  static createEmpty() {
    return new TeamStateSet(defaultFactory());
  }

  static createKeyed(keys: string[], width: number, height: number) {
    const list: [string, DrawState][] = keys.map((k) => [
      k,
      DrawState.createEmpty(width, height),
    ]);

    return new TeamStateSet(
      defaultFactory().set("keys", List(keys)).set("states", OrderedMap(list))
    );
  }

  static createFromList(list: [string, DrawState][]) {
    return new TeamStateSet(
      defaultFactory()
        .set("keys", List(list.map((item) => item[0])))
        .set("states", OrderedMap(list))
    );
  }

  setState(uid: string, drawState: DrawState) {
    let newImmu = this.getImmutable().update("states", (s) =>
      s.set(uid, drawState)
    );
    return new TeamStateSet(newImmu);
  }

  pushStroke(uid: string, stroke: Stroke) {
    const prevDs = this.getImmutable().get("states").get(uid);
    if (!prevDs) return this;
    const ds = DrawState.simplePush(prevDs, stroke);
    return this.setState(uid, ds);
  }

  getImmutable() {
    return this.immutable;
  }

  getOneState(uid: string) {
    return this.getImmutable().get("states").get(uid);
  }
}
