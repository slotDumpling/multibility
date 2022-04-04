import { useEffect, useMemo } from "react";

export function useObjectUrl(obj: Blob | MediaSource | undefined) {
  const url = useMemo(
    () => (obj ? URL.createObjectURL(obj) : null),
    [obj]
  );

  useEffect(() => {
    const prevUrl = url || "";
    return () => URL.revokeObjectURL(prevUrl);
  }, [url]);

  return url;
}