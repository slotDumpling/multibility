import { HeaderLeft } from "./Left";
import { HeaderMiddle } from "./Middle";
import { HeaderRight } from "./Right";
import "./header.sass";

export default function ReaderHeader({
  saved,
  handleUndo,
  handleRedo,
  instantSave,
}: {
  saved: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  instantSave: () => Promise<void> | undefined;
}) {
  return (
    <header>
      <HeaderLeft saved={saved} instantSave={instantSave} />
      <HeaderMiddle handleUndo={handleUndo} handleRedo={handleRedo} />
      <HeaderRight instantSave={instantSave} />
    </header>
  );
}
