import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import MainMenu from "./component/menu/MainMenu";
import Test from "./component/Test";
import { message } from "antd";
import "./index.sass";
const Reader = React.lazy(() => import("./component/reader/Reader"));
const Team = React.lazy(() => import("./component/reader/Team"));

message.config({ top: 60 });

const placeholderEl = <p>There's nothing here!</p>;

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/reader">
        <Route
          path=":noteID"
          element={
            <Suspense fallback={null}>
              <Reader teamOn={false} />
            </Suspense>
          }
        />
      </Route>
      <Route path="/team">
        <Route
          path=":noteID"
          element={
            <Suspense fallback={null}>
              <Team />
            </Suspense>
          }
        />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="*" element={placeholderEl} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
