import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
} from "react";
import {
  MoreOutlined,
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from "react-beautiful-dnd";
import { PageWrapper, ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import { Avatar, Button, Drawer, Menu, Popover, Tabs } from "antd";
import { AddPageButton } from "./ReaderUtils";
import { exchange } from "../../lib/array";
import { Setter } from "../../lib/hooks";
import IconFont from "../ui/IconFont";
import classNames from "classnames";
import { TeamCtx } from "./Team";
import "./preview.sass";
import { UserAvatar } from "./header/Right";

const PreviewCtx = React.createContext({
  activeKey: "ALL",
  setActiveKey: (() => {}) as Setter<string>,
});

const PageNavContent = () => {
  const { pageOrder, currPageID } = useContext(ReaderStateCtx);
  const { scrollPage, saveReorder } = useContext(ReaderMethodCtx);
  const { activeKey } = useContext(PreviewCtx);
  const refRec = useRef<Record<string, HTMLElement>>({});

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !pageOrder) return;
    const { index: fromIndex } = source;
    const { index: toIndex } = destination;
    if (fromIndex === toIndex) return;
    const pageID = pageOrder[fromIndex];
    const newOrder = exchange(pageOrder, fromIndex, toIndex);
    saveReorder(newOrder, true);
    requestAnimationFrame(() => scrollPage(pageID));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refRec.current[currPageID]?.scrollIntoView(), []);

  return (
    <div className="preview-container">
      <PreviewTabs />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="preview-list">
          {({ droppableProps, innerRef, placeholder }) => (
            <div className="page-list" ref={innerRef} {...droppableProps}>
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
    </div>
  );
};

const PagePreview: FC<{
  uid: string;
  pageIndex: number;
  refRec: Record<string, HTMLElement>;
}> = ({ uid, pageIndex, refRec }) => {
  const { stateSet, teamState, pageRec, currPageID } =
    useContext(ReaderStateCtx);
  const { scrollPage } = useContext(ReaderMethodCtx);
  const { activeKey } = useContext(PreviewCtx);
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
          className={classNames("page", { curr, dragged })}
          onClick={() => scrollPage(uid)}
          {...draggableProps}
          {...dragHandleProps}
        >
          <PageWrapper
            uid={uid}
            drawState={teamStateMap?.get(chosen) || drawState}
            teamStateMap={chosen ? undefined : teamStateMap}
            thumbnail={image}
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
  const { teamState, pageRec } = useContext(ReaderStateCtx);
  const { ignores } = useContext(TeamCtx);
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
    <div onClick={(e) => e.stopPropagation()}>
      <span
        className={classNames("bookmark", { marked })}
        onClick={() => switchPageMarked(uid)}
      />
      <span className="index">{index + 1}</span>
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
  return (
    <Avatar.Group
      maxCount={2}
      size="default"
      className={classNames("team-group", { chosen })}
    >
      {userIDs.map((userID) => (
        <UserAvatar
          key={userID}
          size="default"
          userID={userID}
          className="preview-avatar"
          chosen={chosen === userID}
          onClick={() => setChosen((prev) => (prev === userID ? "" : userID))}
        />
      ))}
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
      <span className="option">
        <MoreOutlined />
      </span>
    </Popover>
  );
};

const PreviewTabs = () => {
  const { activeKey, setActiveKey } = useContext(PreviewCtx);
  const { TabPane } = Tabs;
  return (
    <Tabs
      className="tabs"
      activeKey={activeKey}
      onChange={setActiveKey}
      tabBarGutter={10}
      size="small"
      centered
    >
      <TabPane tab={<IconFont type="icon-uf_paper" />} key="ALL" />
      <TabPane tab={<IconFont type="icon-bookmark2" />} key="MARKED" />
      <TabPane tab={<IconFont type="icon-write" />} key="WRITTEN" />
    </Tabs>
  );
};

export default function PageNav() {
  const [navOn, setNavOn] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("ALL");
  const title = {
    ALL: "All Pages",
    MARKED: "Bookmarks",
    WRITTEN: "Notes",
  }[activeKey];

  return (
    <PreviewCtx.Provider value={{ activeKey, setActiveKey }}>
      <Button
        type="text"
        icon={navOn ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setNavOn((prev) => !prev)}
      />
      <Drawer
        visible={navOn}
        onClose={() => setNavOn(false)}
        width={200}
        title={title}
        closable={false}
        zIndex={800}
        className="preview-drawer"
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        headerStyle={{ textAlign: "center" }}
        destroyOnClose
      >
        <PageNavContent />
      </Drawer>
    </PreviewCtx.Provider>
  );
}
