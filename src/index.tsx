import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import MainMenu from "./component/menu/MainMenu";
import Reader from "./component/reader/Reader";
import Test from "./component/Test";
import Team from "./component/reader/Team";
// import Stats from "stats.js";

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

// const stats = new Stats();
// stats.showPanel(2);
// document.body.appendChild(stats.dom);

// const updateStats = () => {
//   stats.update();
//   requestAnimationFrame(updateStats);
// };
// updateStats();
