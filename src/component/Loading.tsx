import { Skeleton } from "antd";
import { FC, PropsWithChildren } from "react";

export const Loading: FC<PropsWithChildren<{ loading?: boolean }>> = ({
  children,
  loading = true,
}) => {
  return loading ? (
    <div className="load-wrapper">
      <h1 className="loading">Multibility</h1>
      <Skeleton className="skeleton" active />
    </div>
  ) : (
    <>{children}</>
  );
};

export const Page404 = () => (
  <h1 style={{ paddingTop: 40, textAlign: "center" }}>
    There's nothing here! <a href="/">Go Back.</a>
  </h1>
);
