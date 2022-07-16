import { FC } from "react";
import { HeaderLeft } from "./Left";
import { HeaderMiddle } from "./Middle";
import { HeaderRight } from "./Right";
import "./header.sass";
import { useForceLight } from "lib/Dark";

export const Header: FC<{
  saved: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}> = ({ saved, handleUndo, handleRedo, instantSave }) => {
  const [forceLight] = useForceLight();

  return (
    <header data-force-light={forceLight}>
      <HeaderLeft saved={saved} instantSave={instantSave} />
      <HeaderMiddle handleUndo={handleUndo} handleRedo={handleRedo} />
      <HeaderRight instantSave={instantSave} />
    </header>
  );
};
