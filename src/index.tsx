import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import MainMenu from "./component/menu/MainMenu";
import Test from "./component/Test";
import "./index.sass";
const Reader = React.lazy(() => import("./component/reader/Reader"));
const Team = React.lazy(() => import("./component/reader/Team"));
const lazyReader = (
  <Suspense fallback={null}>
    <Reader teamOn={false} />
  </Suspense>
);
const lazyTeam = (
  <Suspense fallback={null}>
    <Team />
  </Suspense>
);

const placeholderEl = (
  <h1>
    There's nothing here! <a href="/">Go Back.</a>
  </h1>
);

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/reader">
          <Route path=":noteID" element={lazyReader} />
        </Route>
        <Route path="/team">
          <Route path=":noteID" element={lazyTeam} />
        </Route>
        <Route path="/test" element={<Test />} />
        <Route path="*" element={placeholderEl} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
