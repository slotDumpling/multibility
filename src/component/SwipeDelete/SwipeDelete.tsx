import React, {
  FC,
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import { Setter, useTransitionEnd } from "lib/hooks";
import { useSwipeable } from "react-swipeable";
import classNames from "classnames";
import { v4 as getUid } from "uuid";
import "./swipe-delete.sass";

const SwipeCtx = createContext<[string, Setter<string>]>(["", () => {}]);

export const SwipeDeleteProvider: FC = ({ children }) => {
  const tuple = useState("");
  return <SwipeCtx.Provider value={tuple}>{children}</SwipeCtx.Provider>;
};

export const SwipeDelete: FC<{
  onDelete: () => void;
  disable?: boolean;
  className?: string;
}> = ({ children, onDelete, disable = false, className }) => {
  const [uid] = useState(getUid);

  const [nowSwiped, setNowSwiped] = useContext(SwipeCtx);
  const [swiped, setSwiped] = useState(false);
  const deleting = swiped && (!nowSwiped || nowSwiped === uid);
  const [deleted, setDeleted] = useState(false);

  const [height, setHeight] = useState<number>();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nowSwiped !== uid) setSwiped(false);
  }, [nowSwiped, uid]);

  const showDelete = () => {
    setSwiped(true);
    setNowSwiped(uid);
    setHeight(wrapper.current?.clientHeight);
  };

  const hideDelete = () => {
    setSwiped(false);
    setNowSwiped("");
    setHeight(undefined);
  };

  const swipeHandler = useSwipeable({
    onSwipedLeft: showDelete,
    onSwipedRight: hideDelete,
    preventDefaultTouchmoveEvent: true,
    trackTouch: !disable,
  });

  useEffect(() => {
    if (!disable) return;
    setHeight(undefined);
    setNowSwiped("");
    setSwiped(false);
  }, [disable, setNowSwiped]);

  const [transDidEnd, handler] = useTransitionEnd({
    propertyName: "height",
    active: deleted,
  });
  const handleClick = async () => {
    setDeleted(true);
    await transDidEnd;
    onDelete();
    setNowSwiped("");
  };

  return (
    <div
      className={classNames("swipe-wrapper", className)}
      data-deleted={deleted}
      data-deleting={deleting}
      {...swipeHandler}
      style={{ height }}
      onTransitionEnd={handler}
    >
      <div className="content" ref={wrapper}>
        {children}
      </div>
      <div className="button" onClick={handleClick} style={{ height }}>
        Delete
      </div>
    </div>
  );
};