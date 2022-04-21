import React, { useEffect, useMemo, useRef } from "react";

// export function useObjectUrl(obj: Blob | MediaSource | undefined) {
//   const url = useMemo(() => (obj ? URL.createObjectURL(obj) : undefined), [obj]);

//   useEffect(() => {
//     const prevUrl = url || "";
//     return () => URL.revokeObjectURL(prevUrl);
//   }, [url]);

//   return url;
// }

export function useMounted() {
  const _mounted = useRef(false);

  useEffect(() => {
    _mounted.current = true;
    return () => {
      _mounted.current = false;
    };
  }, []);

  return _mounted;
}
