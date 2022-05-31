import { Skeleton } from "antd";
import React, { FC } from "react";

export const Loading: FC<{ loading?: boolean }> = ({
  children,
  loading = true,
}) => {
  return (
    <>
      {loading && <h1 className="loading">Multibility</h1>}
      <Skeleton className="skeleton" loading={loading} active>
        {children}
      </Skeleton>
    </>
  );
};
