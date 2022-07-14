import { Nav } from "./Nav";
import { FC } from "react";
import "./header.sass";

export const MenuHeader: FC = ({ children }) => {
  return (
    <header>
      <Nav />
      {children}
    </header>
  );
};
