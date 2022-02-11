import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import MainMenu from "./component/menu/MainMenu";
import Reader from "./component/reader/Reader";
import Test from "./component/Test";
import Team from "./component/reader/Team";

const placeholderEl = (
  <main style={{ padding: "1rem" }}>
    <p>There's nothing here!</p>
  </main>
);

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/reader">
        <Route path=":noteId" element={<Reader teamOn={false} />} />
      </Route>
      <Route path="/team">
        <Route path=":noteId" element={<Team />} />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="*" element={placeholderEl} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
