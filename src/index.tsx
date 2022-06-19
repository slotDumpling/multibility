import React, { LazyExoticComponent, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import Test from "./component/Test";
import { Loading } from "./component/ui/Loading";
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

const placeholderEl = (
  <h1>
    There's nothing here! <a href="/">Go Back.</a>
  </h1>
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
      <Route path="*" element={placeholderEl} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
