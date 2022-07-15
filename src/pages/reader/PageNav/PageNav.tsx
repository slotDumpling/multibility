import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import {
  MenuOutlined,
  MoreOutlined,
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from "react-beautiful-dnd";
import { Avatar, Button, Menu, Popover, Tabs } from "antd";
import {
  ActiveKeyProvider,
  Setter,
  useActiveKey,
  useAsideOpen,
} from "lib/hooks";
import { ReaderMethodCtx, ReaderStateCtx } from "../Reader";
import PageWrapper from "component/PageWrapper";
import { UserAvatar } from "component/UserAvatar";
import { useForceLight } from "lib/Dark";
import { AddPageButton } from "../ReaderUtils";
import { exchange } from "../lib/array";
import IconFont from "component/IconFont";
import classNames from "classnames";
import { TeamCtx } from "../Team";
import { useMemoizedFn as useEvent } from "ahooks";
import "./preview.sass";

const PreviewCard: FC<{ left: boolean }> = ({ left }) => {
  const [forceLight] = useForceLight();
  const [activeKey] = useActiveKey();
  const title = {
    ALL: "All Pages",
    MARKED: "Bookmarks",
    WRITTEN: "Notes",
  }[activeKey];

  return (
    <Draggable draggableId={"CARD"} index={left ? 0 : 1}>
      {({ innerRef, draggableProps, dragHandleProps }, { isDragging }) => (
        <div
          className="preview-card"
          ref={innerRef}
          data-force-light={forceLight}
          {...draggableProps}
        >
          <div className="drag-handle" {...dragHandleProps} />
          <h3>{title}</h3>
          <PreviewTabs />
          <PageList dragged={isDragging} />
        </div>
      )}
    </Draggable>
  );
};

const PageList: FC<{ dragged: boolean }> = React.memo(({ dragged }) => {
  const { pageOrder, currPageID } = useContext(ReaderStateCtx);
  const { scrollPage, saveReorder } = useContext(ReaderMethodCtx);
  const refRec = useRef<Record<string, HTMLElement>>({});
  const [activeKey] = useActiveKey();
  const [asideOpen] = useAsideOpen();

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !pageOrder) return;
    const { index: fromIndex } = source;
    const { index: toIndex } = destination;
    const pageID = pageOrder[fromIndex];
    if (fromIndex === toIndex || !pageID) return;
    const newOrder = exchange(pageOrder, fromIndex, toIndex);
    saveReorder(newOrder, true);
    requestAnimationFrame(() => scrollPage(pageID));
  };

  const initScroll = useEvent(() => {
    refRec.current[currPageID]?.scrollIntoView();
  });
  useLayoutEffect(() => {
    if (asideOpen) initScroll();
  }, [asideOpen, initScroll]);

  const listRef = useRef<HTMLDivElement>();
  const scrollTop = useRef(0);
  useLayoutEffect(() => {
    if (!listRef.current) return;
    if (dragged) {
      scrollTop.current = listRef.current.scrollTop;
    } else {
      listRef.current.scrollTop = scrollTop.current;
    }
  }, [dragged]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="preview-list">
        {({ droppableProps, innerRef, placeholder }) => (
          <div
            className="page-list"
            ref={(e) => {
              e && (listRef.current = e);
              innerRef(e);
            }}
            {...droppableProps}
          >
            {pageOrder?.map((uid, index) => (
              <PagePreview
                key={uid}
                uid={uid}
                pageIndex={index}
                refRec={refRec.current}
              />
            ))}
            {placeholder}
            {activeKey === "ALL" && <AddPageButton />}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

const PagePreview: FC<{
  uid: string;
  pageIndex: number;
  refRec: Record<string, HTMLElement>;
}> = ({ uid, pageIndex, refRec }) => {
  const { stateSet, pageRec, currPageID } = useContext(ReaderStateCtx);
  const { teamState, ignores } = useContext(TeamCtx);
  const { scrollPage } = useContext(ReaderMethodCtx);
  const [activeKey] = useActiveKey();
  const [chosen, setChosen] = useState("");

  const page = pageRec?.get(uid);
  const drawState = stateSet?.getOneState(uid);
  const teamStateMap = teamState?.getOnePageStateMap(uid);

  if (!page || !drawState) return null;
  const { image, marked } = page;

  if (
    activeKey === "WRITTEN" &&
    drawState.isEmpty() &&
    (!teamStateMap || teamStateMap.every((ds) => ds.isEmpty()))
  ) {
    return null;
  }
  if (activeKey === "MARKED" && !marked) return null;
  const curr = currPageID === uid;

  return (
    <Draggable
      draggableId={uid}
      index={pageIndex}
      isDragDisabled={activeKey !== "ALL"}
    >
      {(
        { innerRef, draggableProps, dragHandleProps },
        { isDragging: dragged }
      ) => (
        <div
          ref={(e) => {
            innerRef(e);
            if (e) refRec[uid] = e;
          }}
          className="page"
          data-curr={curr}
          data-dragged={dragged}
          onClick={() => scrollPage(uid)}
          {...draggableProps}
          {...dragHandleProps}
        >
          <PageWrapper
            drawState={teamStateMap?.get(chosen) || drawState}
            teamStateMap={chosen ? undefined : teamStateMap}
            thumbnail={image}
            ignores={ignores}
            preview
          />
          <PreviewTools
            uid={uid}
            index={pageIndex}
            chosen={chosen}
            setChosen={setChosen}
          />
        </div>
      )}
    </Draggable>
  );
};

const PreviewTools: FC<{
  uid: string;
  index: number;
  chosen: string;
  setChosen: Setter<string>;
}> = ({ uid, index, chosen, setChosen }) => {
  const { switchPageMarked } = useContext(ReaderMethodCtx);
  const { pageRec } = useContext(ReaderStateCtx);
  const { ignores, teamState } = useContext(TeamCtx);
  const userIDs = useMemo(
    () =>
      teamState
        ?.getPageValidUsers(uid)
        .filter((userID) => !ignores.has(userID)) || [],
    [teamState, ignores, uid]
  );
  const page = pageRec?.get(uid);
  if (!page) return null;
  const { marked } = page;

  return (
    <div className="tools" onClick={(e) => e.stopPropagation()}>
      <div
        className="bookmark"
        data-marked={marked}
        onClick={() => switchPageMarked(uid)}
      />
      <div className="index">{index + 1}</div>
      <PreviewOption uid={uid} />
      <TeamAvatars userIDs={userIDs} chosen={chosen} setChosen={setChosen} />
    </div>
  );
};

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

const PreviewOption = ({ uid }: { uid: string }) => {
  const { addPage, deletePage } = useContext(ReaderMethodCtx);

  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === "ADD") {
          addPage(uid);
        } else if (key === "COPY") {
          addPage(uid, true);
        } else if (key === "DELETE") {
          deletePage(uid);
        }
      }}
      items={[
        { key: "ADD", icon: <PlusOutlined />, label: "Add page" },
        { key: "COPY", icon: <CopyOutlined />, label: "Duplicate" },
        {
          key: "DELETE",
          icon: <DeleteOutlined />,
          label: "Delete",
          danger: true,
        },
      ]}
    ></Menu>
  );
  return (
    <Popover
      content={menu}
      trigger="click"
      placement="left"
      destroyTooltipOnHide
    >
      <div className="option">
        <MoreOutlined />
      </div>
    </Popover>
  );
};

const PreviewTabs = () => {
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
};

export const PageNav = () => {
  const [left, setLeft] = useState(false);
  const [asideOpen] = useAsideOpen();

  const previewBody = <PreviewCard left={left} key="preview-drag" />;

  const opposite = (
    <Draggable key="opposite" draggableId="opposite" index={left ? 1 : 0}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          className="opposite"
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
        />
      )}
    </Draggable>
  );

  return (
    <ActiveKeyProvider initKey="ALL">
      <DragDropContext
        onDragEnd={({ draggableId, destination }) => {
          if (draggableId !== "CARD") return;
          if (destination?.index === 0) setLeft(true);
          if (destination?.index === 1) setLeft(false);
        }}
      >
        <Droppable droppableId="preview-drop" direction="horizontal">
          {({ droppableProps, innerRef, placeholder }) => (
            <div
              className="preview-drop"
              data-left={left}
              data-open={asideOpen}
              ref={innerRef}
              {...droppableProps}
            >
              {left ? [previewBody, opposite] : [opposite, previewBody]}
              {placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ActiveKeyProvider>
  );
};

export const PageNavButton = () => {
  const [, setAsideOpen] = useAsideOpen();
  return (
    <Button
      type="text"
      icon={<MenuOutlined />}
      onClick={() => setAsideOpen((prev) => !prev)}
    />
  );
};
