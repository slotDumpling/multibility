import { Skeleton } from "antd";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import Test from "./component/Test";
import "./index.sass";
const MainMenu = React.lazy(() => import("./component/menu/MainMenu"));
const Reader = React.lazy(() => import("./component/reader/Reader"));
const Team = React.lazy(() => import("./component/reader/Team"));
const fbSkeleton = <Skeleton className="skeleton" active />;
const lazyMenu = (
  <Suspense fallback={fbSkeleton}>
    <MainMenu />
  </Suspense>
);
const lazyReader = (
  <Suspense fallback={fbSkeleton}>
    <Reader />
  </Suspense>
);
const lazyTeam = (
  <Suspense fallback={fbSkeleton}>
    <Team />
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
      <Route path="/" element={lazyMenu} />
      <Route path="/reader">
        <Route path=":noteID" element={lazyReader} />
      </Route>
      <Route path="/team">
        <Route path=":noteID" element={lazyTeam} />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="*" element={placeholderEl} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
