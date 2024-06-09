import { FC } from "react";
import { HeaderLeft } from "./Left";
import { HeaderMiddle } from "./Middle";
import { HeaderRight } from "./Right";
import "./header.sass";

export const Header: FC<{
  saved: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  undoable: boolean;
  redoable: boolean;
  instantSave: () => Promise<void> | undefined;
  handleExportPDF: () => Promise<void>;
}> = ({ saved, instantSave, handleExportPDF, ...undoProps }) => (
  <header>
    <HeaderLeft
      saved={saved}
      instantSave={instantSave}
      handleExportPDF={handleExportPDF}
    />
    <HeaderMiddle {...undoProps} />
    <HeaderRight instantSave={instantSave} />
  </header>
);
