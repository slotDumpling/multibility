import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSwipeable } from "react-swipeable";
import classNames from "classnames";
import "./swipe-delete.sass";
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
  uid: string;
  disable?: boolean;
  className?: string;
}> = ({ children, uid, onDelete, disable = false, className }) => {
  const [deleted, setDeleted] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [height, setHeight] = useState<number>();
  const wrapper = useRef<HTMLDivElement>(null);
  const { nowSwiped, setNowSwiped } = useContext(SwipedCtx);
  const deleting = swiped && (!nowSwiped || nowSwiped === uid);

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

  const [transEnd, resolve] = useEventWaiter();

  return (
    <div
      className={classNames("swipe-wrapper", className, {
        deleted,
        deleting,
      })}
      {...swipeHandler}
      style={{ height }}
      onTransitionEnd={({ propertyName: p }) => {
        if (p === "height" && deleted) resolve();
      }}
    >
      <div className="content" ref={wrapper}>
        {children}
      </div>
      <div
        className="button"
        onClick={() => {
          setDeleted(true);
          transEnd().then(onDelete);
        }}
        style={{ height }}
      >
        Delete
      </div>
    </div>
  );
};
