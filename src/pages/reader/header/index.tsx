import { FC } from "react";
import { HeaderLeft } from "./Left";
import { HeaderMiddle } from "./Middle";
import { HeaderRight } from "./Right";
import "./header.sass";

export const Header: FC<{
  saved: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}> = ({ saved, handleUndo, handleRedo, instantSave }) => (
  <header>
    <HeaderLeft saved={saved} instantSave={instantSave} />
    <HeaderMiddle handleUndo={handleUndo} handleRedo={handleRedo} />
    <HeaderRight instantSave={instantSave} />
  </header>
);
