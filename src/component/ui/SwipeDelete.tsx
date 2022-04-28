import classNames from "classnames";
import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSwipeable } from "react-swipeable";
import { DeleteOutlined } from "@ant-design/icons";
import "./swipe-delete.sass";
import { Setter } from "../../lib/hooks";

const SwipeDelete: FC<{
  onDelete: () => void;
  uid: string;
  nowSwiped?: string;
  setNowSwiped?: Setter<string>;
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
  }, [disable]);

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
