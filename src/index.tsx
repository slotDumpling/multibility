import React, { LazyExoticComponent, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { Loading, Page404 } from "./component/ui/Loading";
import { loadDarkMode } from "./lib/drak";
import Test from "./component/Test";
import ReactDOM from "react-dom";
import "./index.sass";

const MainMenu = React.lazy(() => import("./component/menu/MainMenu"));
const Reader = React.lazy(() => import("./component/reader/Reader"));
const Team = React.lazy(() => import("./component/reader/Team"));
const SuspendLazy = (Component: LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={SuspendLazy(MainMenu)} />
      <Route path="/reader">
        <Route path=":noteID" element={SuspendLazy(Reader)} />
      </Route>
      <Route path="/team">
        <Route path=":noteID" element={SuspendLazy(Team)} />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);

loadDarkMode();

serviceWorkerRegistration.register();
