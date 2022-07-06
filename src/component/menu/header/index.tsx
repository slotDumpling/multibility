import { useContext } from "react";
import { MenuCtx } from "../MainMenu";
import Left from "./Left";
import Right from "./Right";
import "./header.sass";

export function MenuHeader() {
  const { tagUid, allTags } = useContext(MenuCtx);
  const logo = tagUid === "DEFAULT";
  return (
    <header>
      <Left />
      <h2 data-logo={logo}>{logo ? "Multibility" : allTags[tagUid]?.name}</h2>
      <Right />
    </header>
  );
}
