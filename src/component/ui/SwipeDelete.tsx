import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  TransitionEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSwipeable } from "react-swipeable";
import classNames from "classnames";
import "./swipe-delete.sass";
import { v4 as getUid } from "uuid";
import { useEventWaiter } from "../../lib/hooks";

const SwipedCtx = createContext({
  nowSwiped: "",
  setNowSwiped: (() => {}) as Dispatch<SetStateAction<string>>,
});

export const SwipeDeleteContext: FC = ({ children }) => {
  const [nowSwiped, setNowSwiped] = useState("");
  return (
    <SwipedCtx.Provider value={{ nowSwiped, setNowSwiped }}>
      {children}
    </SwipedCtx.Provider>
  );
};

export const SwipeDelete: FC<{
  onDelete: () => void;
  disable?: boolean;
  className?: string;
}> = ({ children, onDelete, disable = false, className }) => {
  const [uid] = useState(getUid);

  const { nowSwiped, setNowSwiped } = useContext(SwipedCtx);
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

  const [transDidEnd, transEnd] = useEventWaiter();
  const handleClick = async () => {
    setDeleted(true);
    await transDidEnd;
    onDelete();
    setNowSwiped("");
  };

  const handleTransEnd: TransitionEventHandler = (e) => {
    if (e.propertyName === "height" && deleted) transEnd();
  };

  return (
    <div
      className={classNames("swipe-wrapper", className)}
      data-deleted={deleted}
      data-deleting={deleting}
      {...swipeHandler}
      style={{ height }}
      onTransitionEnd={handleTransEnd}
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
