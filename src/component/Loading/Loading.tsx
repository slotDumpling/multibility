import { FC, PropsWithChildren } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export const Loading: FC<PropsWithChildren<{ loading?: boolean }>> = ({
  children,
  loading = true,
}) => {
  return loading ? (
    <div className="load-wrapper">
      <LoadingOutlined className="loading-icon" />
      <h1 className="loading">Multibility</h1>
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
