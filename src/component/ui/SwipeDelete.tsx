import classNames from "classnames";
import React, { Dispatch, FC, SetStateAction, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { DeleteOutlined } from "@ant-design/icons";
import "./swipe-delete.sass";

const SwipeDelete: FC<{
  onDelete: () => void;
  uid: string;
  nowSwiped?: string;
  setNowSwiped?: Dispatch<SetStateAction<string>>;
  disable?: boolean;
  icon?: boolean;
}> = ({
  children,
  nowSwiped,
  setNowSwiped,
  uid,
  onDelete,
  disable = false,
  icon = false,
}) => {
  const [deleted, setDeleted] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [height, setHeight] = useState<number>();
  const button = useRef<HTMLDivElement>(null);
  const deleting =
    swiped && (nowSwiped === undefined || nowSwiped === uid) && !disable;

  const showDelete = () => {
    setSwiped(true);
    setNowSwiped && setNowSwiped(uid);
    setHeight(button.current?.clientHeight);
  };

  const hideDelete = () => {
    setSwiped(false);
    setNowSwiped && setNowSwiped("");
    setHeight(undefined)
  };

  const swipeHandler = useSwipeable({
    onSwipedLeft: showDelete,
    onSwipedRight: hideDelete,
    preventDefaultTouchmoveEvent: true,
    trackTouch: !disable,
  });

  return (
    <div
      className={classNames("swipe-wrapper", { deleted, deleting, icon })}
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
