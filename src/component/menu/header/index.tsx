import { useContext } from "react";
import { MenuCtx } from "../MainMenu";
import Left from "./Left";
import Right from "./Right";
import "./header.sass";

export function MenuHeader() {
  const { currTagID, allTags } = useContext(MenuCtx);
  const logo = currTagID === "DEFAULT";
  return (
    <header>
      <Left />
      <h2 data-logo={logo}>
        {logo ? "Multibility" : allTags[currTagID]?.name}
      </h2>
      <Right />
    </header>
  );
}
