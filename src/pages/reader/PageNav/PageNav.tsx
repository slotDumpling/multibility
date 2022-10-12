import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import {
  MoreOutlined,
  PlusOutlined,
  CopyOutlined,
  ReadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from "react-beautiful-dnd";
import { Avatar, Button, Menu, Pagination, Popover, Select, Tabs } from "antd";
import {
  Setter,
  useActiveKey,
  useAsideOpen,
  ActiveKeyProvider,
} from "lib/hooks";
import { ReaderMethods, ReaderStates } from "../Reader";
import PageWrapper from "component/PageWrapper";
import { UserAvatar } from "component/UserAvatar";
import { exchange } from "../lib/array";
import IconFont from "component/IconFont";
import classNames from "classnames";
import { TeamCtx } from "../Team";
import { useMemoizedFn as useEvent } from "ahooks";
import { useSwipeable } from "react-swipeable";
import { NotePage } from "lib/note/note";
import { TeamState } from "lib/draw/TeamState";
import { AddPageButton } from "../tools/AddButton";
import { CSSTransition } from "react-transition-group";

type PreviewProps = ReaderMethods & ReaderStates;
export const PageNav: FC<PreviewProps> = (props) => {
  const [left, setLeft] = useState(false);
  const [asideOpen] = useAsideOpen();

  const opposite = (
    <Draggable draggableId="OPPOSITE" index={left ? 1 : 0} isDragDisabled>
      {({ innerRef }) => <div className="opposite" ref={innerRef} />}
    </Draggable>
  );

  return (
    <CSSTransition in={asideOpen} timeout={300} unmountOnExit>
      <ActiveKeyProvider initKey="ALL">
        <DragDropContext
          onDragEnd={({ destination }) => {
            if (destination?.index === 0) setLeft(true);
            if (destination?.index === 1) setLeft(false);
          }}
        >
          <Droppable droppableId="preview-drop" direction="horizontal">
            {(
              { droppableProps, innerRef, placeholder },
              { isDraggingOver }
            ) => (
              <aside
                className="preview-drop"
                data-left={left}
                ref={innerRef}
                data-dragged={isDraggingOver}
                {...droppableProps}
              >
                {opposite}
                <PreviewCard left={left} {...props} />
                {placeholder}
              </aside>
            )}
          </Droppable>
        </DragDropContext>
      </ActiveKeyProvider>
    </CSSTransition>
  );
};

const PreviewCard: FC<{ left: boolean } & PreviewProps> = ({
  left,
  ...props
}) => {
  const [activeKey] = useActiveKey();
  const [, setAsideOpen] = useAsideOpen();

  const title = {
    ALL: "All Pages",
    MARKED: "Bookmarks",
    WRITTEN: "Notes",
  }[activeKey];

  const { ref: swipeRef, ...swipeHandler } = useSwipeable({
    onSwipedLeft() {
      if (left) setAsideOpen(false);
    },
    onSwipedRight() {
      if (!left) setAsideOpen(false);
    },
    swipeDuration: 200,
  });

  return (
    <Draggable draggableId={"CARD"} index={left ? 0 : 1}>
      {(
        { innerRef, draggableProps, dragHandleProps },
        { isDragging, isDropAnimating }
      ) => (
        <div
          className="preview-card"
          ref={(e) => {
            innerRef(e);
            swipeRef(e);
          }}
          data-animating={isDropAnimating}
          {...draggableProps}
          {...swipeHandler}
        >
          <div className="drag-handle" {...dragHandleProps} />
          <h3>{title}</h3>
          <PreviewTabs />
          <PageList cardDragged={isDragging} {...props} />
          <PreviewFooter {...props} />
        </div>
      )}
    </Draggable>
  );
};

const PageList: FC<PreviewProps & { cardDragged: boolean }> = React.memo(
  ({ cardDragged, ...props }) => {
    const refRec = useRef<Record<string, HTMLElement>>({});
    const [activeKey] = useActiveKey();
    const [asideOpen] = useAsideOpen();
    const { pageOrder, currPageID } = props;
    const { saveReorder, addFinalPage } = props;

    const onDragEnd = ({ source, destination }: DropResult) => {
      if (!destination || !pageOrder) return;
      const { index: fromIndex } = source;
      const { index: toIndex } = destination;
      const pageID = pageOrder[fromIndex];
      if (fromIndex === toIndex || !pageID) return;
      const newOrder = exchange(pageOrder, fromIndex, toIndex);
      saveReorder(newOrder, true);
    };

    const initScroll = useEvent(() => {
      refRec.current[currPageID]?.scrollIntoView();
    });
    useLayoutEffect(() => {
      if (asideOpen) initScroll();
    }, [asideOpen, activeKey, initScroll]);

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="preview-list" isDropDisabled={cardDragged}>
          {({ droppableProps, innerRef, placeholder }) => (
            <div className="page-list" ref={innerRef} {...droppableProps}>
              {pageOrder.map((uid, index) => (
                <PagePreview
                  key={uid}
                  uid={uid}
                  pageIndex={index}
                  refRec={refRec.current}
                  cardDragged={cardDragged}
                  {...props}
                />
              ))}
              {placeholder}
              {activeKey === "ALL" && (
                <AddPageButton addFinalPage={addFinalPage} />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
);
PageList.displayName = "PageList";

const PagePreview: FC<
  {
    uid: string;
    pageIndex: number;
    refRec: Record<string, HTMLElement>;
    cardDragged: boolean;
  } & PreviewProps
> = ({ uid, pageIndex, refRec, cardDragged, ...props }) => {
  const { stateSet, pageRec, currPageID, scrollPage } = props;
  const { teamState, ignores } = useContext(TeamCtx);
  const [activeKey] = useActiveKey();
  const [chosen, setChosen] = useState("");

  const page = pageRec.get(uid);
  const drawState = stateSet.getOneState(uid);
  const teamStateMap = teamState?.getOnePageStateMap(uid);

  const marked = useRef(false);
  if (activeKey === "MARKED") {
    marked.current = page?.marked || marked.current;
  } else {
    marked.current = false;
  }

  const userIDs = useMemo(
    () => TeamState.getValidUsers(teamStateMap, ignores),
    [teamStateMap, ignores]
  );

  if (!page || !drawState) return null;

  if (
    activeKey === "WRITTEN" &&
    drawState.isEmpty() &&
    TeamState.isEmpty(teamStateMap)
  ) {
    return null;
  }
  if (activeKey === "MARKED" && !marked.current) return null;
  const curr = currPageID === uid;

  return (
    <Draggable
      draggableId={uid}
      index={pageIndex}
      isDragDisabled={activeKey !== "ALL" || cardDragged}
    >
      {(
        { innerRef, draggableProps, dragHandleProps },
        { isDragging, isDropAnimating }
      ) => (
        <div
          ref={(e) => {
            innerRef(e);
            if (e) refRec[uid] = e;
          }}
          className="page"
          data-curr={curr}
          data-dragged={isDragging}
          data-animating={isDropAnimating}
          onClick={() => scrollPage(uid)}
          {...draggableProps}
          {...dragHandleProps}
        >
          <PageWrapper
            drawState={teamStateMap?.get(chosen) || drawState}
            teamStateMap={chosen ? undefined : teamStateMap}
            thumbnail={page.image}
            ignores={ignores}
            preview
            skipInView={isDragging || cardDragged}
          />
          <PreviewTools
            uid={uid}
            index={pageIndex}
            chosen={chosen}
            setChosen={setChosen}
            page={page}
            userIDs={userIDs}
            {...props}
          />
        </div>
      )}
    </Draggable>
  );
};

const PreviewTools: FC<
  {
    uid: string;
    index: number;
    chosen: string;
    setChosen: Setter<string>;
    page: NotePage;
    userIDs: string[];
  } & ReaderMethods
> = React.memo(({ uid, index, chosen, setChosen, page, userIDs, ...props }) => {
  const { switchPageMarked } = props;
  return (
    <div className="tools" onClick={(e) => e.stopPropagation()}>
      <div
        className="bookmark"
        data-marked={page.marked}
        onClick={() => switchPageMarked(uid)}
      />
      <div className="index">{index + 1}</div>
      <PreviewOption uid={uid} {...props} />
      <TeamAvatars userIDs={userIDs} chosen={chosen} setChosen={setChosen} />
    </div>
  );
});
PreviewTools.displayName = "PreviewTools";

const TeamAvatars: FC<{
  userIDs: string[];
  chosen: string;
  setChosen: Setter<string>;
}> = ({ userIDs, chosen, setChosen }) => {
  const { userRec } = useContext(TeamCtx);
  return (
    <Avatar.Group
      maxCount={2}
      size="default"
      className={classNames("team-group", { chosen })}
      maxPopoverPlacement="bottom"
    >
      {userIDs.map((userID) => {
        const userInfo = userRec[userID];
        if (!userInfo) return null;
        return (
          <UserAvatar
            key={userID}
            size="default"
            userInfo={userInfo}
            className="preview-avatar"
            chosen={chosen === userID}
            onClick={() => setChosen((prev) => (prev === userID ? "" : userID))}
          />
        );
      })}
    </Avatar.Group>
  );
};

const PreviewOption: FC<{ uid: string } & ReaderMethods> = ({
  uid,
  addPage,
  deletePage,
}) => {
  const menu = (
    <Menu
      items={[
        {
          key: "ADD",
          icon: <PlusOutlined />,
          label: "Add page",
          onClick: () => addPage(uid),
        },
        {
          key: "COPY",
          icon: <CopyOutlined />,
          label: "Duplicate",
          onClick: () => addPage(uid, true),
        },
        {
          key: "DELETE",
          icon: <DeleteOutlined />,
          label: "Delete",
          danger: true,
          onClick: () => deletePage(uid),
        },
      ]}
    />
  );
  return (
    <Popover
      content={menu}
      trigger="click"
      placement="left"
      destroyTooltipOnHide
      getPopupContainer={(e) => e.parentElement?.parentElement?.parentElement!}
    >
      <div className="option">
        <MoreOutlined />
      </div>
    </Popover>
  );
};

const PreviewTabs: FC = React.memo(() => {
  const [activeKey, setActiveKey] = useActiveKey();
  const { TabPane } = Tabs;
  return (
    <Tabs
      className="tabs"
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarGutter={0}
      size="small"
      centered
    >
      <TabPane tab={<IconFont type="icon-uf_paper" />} key="ALL" />
      <TabPane tab={<IconFont type="icon-bookmark2" />} key="MARKED" />
      <TabPane tab={<IconFont type="icon-write" />} key="WRITTEN" />
    </Tabs>
  );
});
PreviewTabs.displayName = "PreviewTabs";

const PreviewFooter: FC<PreviewProps> = ({
  currPageID,
  pageOrder,
  scrollPage,
  size,
  setSize,
}) => {
  const pageIndex = useMemo(
    () => (pageOrder.indexOf(currPageID) ?? 0) + 1,
    [currPageID, pageOrder]
  );

  const jumpMenu = pageOrder && (
    <Pagination
      pageSize={1}
      total={pageOrder.length}
      simple
      current={pageIndex}
      onChange={(index) => {
        const pageID = pageOrder[index - 1];
        pageID && scrollPage(pageID);
      }}
    />
  );

  return (
    <footer>
      <Popover
        content={jumpMenu}
        trigger="click"
        getPopupContainer={(e) => e.parentElement!}
        destroyTooltipOnHide
      >
        <Button type="text" size="small" icon={<ReadOutlined />}>
          {pageIndex} / {pageOrder.length}
        </Button>
      </Popover>
      <Select
        className="size-select"
        popupClassName="size-drop"
        size="small"
        bordered={false}
        showArrow={false}
        dropdownMatchSelectWidth={80}
        options={[40, 60, 80, 100].map((value) => ({
          value,
          label: value + "%",
        }))}
        value={size}
        onChange={setSize}
        placement="topRight"
        getPopupContainer={(e) => e.parentElement!}
      />
    </footer>
  );
};
