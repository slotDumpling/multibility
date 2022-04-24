import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import MainMenu from "./component/menu/MainMenu";
import Reader from "./component/reader/Reader";
import Test from "./component/Test";
import Team from "./component/reader/Team";
import { message } from "antd";

message.config({ top: 60 });

const placeholderEl = <p>There's nothing here!</p>;

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/reader">
        <Route path=":noteID" element={<Reader teamOn={false} />} />
      </Route>
      <Route path="/team">
        <Route path=":noteID" element={<Team />} />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="*" element={placeholderEl} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
