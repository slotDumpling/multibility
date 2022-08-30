import { FC, PropsWithChildren } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export const Loading: FC<
  PropsWithChildren<{ loading?: boolean; text?: string }>
> = ({ children, loading = true, text = "" }) => {
  return loading ? (
    <div className="load-wrapper">
      <LoadingOutlined className="loading-icon" />
      <h1 className="logo">Multibility</h1>
      <p className="text">{text}</p>
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
