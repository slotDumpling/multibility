import React, { FC, useEffect, useRef, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useSwipeable } from "react-swipeable";
import { Setter } from "../../lib/hooks";
import classNames from "classnames";
import "./swipe-delete.sass";

const SwipeDelete: FC<{
  onDelete: () => void;
  uid: string;
  nowSwiped?: string;
  setNowSwiped?: Setter<string>;
  disable?: boolean;
  icon?: boolean;
  className?: string;
}> = ({
  children,
  nowSwiped,
  setNowSwiped,
  uid,
  onDelete,
  disable = false,
  icon = false,
  className,
}) => {
  const [deleted, setDeleted] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [height, setHeight] = useState<number>();
  const button = useRef<HTMLDivElement>(null);
  const deleting = swiped && (nowSwiped === undefined || nowSwiped === uid);

  const showDelete = () => {
    setSwiped(true);
    setNowSwiped && setNowSwiped(uid);
    setHeight(button.current?.clientHeight);
  };

  const hideDelete = () => {
    setSwiped(false);
    setNowSwiped && setNowSwiped("");
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
    setNowSwiped && setNowSwiped("");
    setSwiped(false);
  }, [disable, setNowSwiped]);

  return (
    <div
      className={classNames("swipe-wrapper", className, {
        deleted,
        deleting,
        icon,
      })}
      {...swipeHandler}
      style={{ height }}
    >
      <div className="content">{children}</div>
      <div
        className="button"
        onClickCapture={(e) => {
          setDeleted(true);
          setTimeout(onDelete, 300);
          e.stopPropagation();
        }}
        ref={button}
      >
        {icon ? <DeleteOutlined /> : <span>Delete</span>}
      </div>
    </div>
  );
};

export default SwipeDelete;
