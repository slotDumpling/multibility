import React, { FC, LazyExoticComponent, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Loading, Page404 } from "./component/Loading";
import { loadDarkMode } from "./lib/Dark";
import { clearServiceWorker } from "temp/stopPWA";
import Test from "./pages/test";
import "./index.sass";

const MainMenu = React.lazy(
  () => import(/* webpackPrefetch: true */ "pages/menu")
);
const Reader = React.lazy(
  () => import(/* webpackPrefetch: true */ "pages/reader/Reader")
);
const Team = React.lazy(
  () => import(/* webpackPrefetch: true */ "pages/reader/Team")
);
const SuspendLazy = (Component: LazyExoticComponent<FC>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const root = createRoot(document.getElementById("root")!);

root.render(
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
  </HashRouter>
);

loadDarkMode();
clearServiceWorker();
