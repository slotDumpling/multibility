import { Button, Drawer, Menu, Popover, Tabs } from "antd";
import React, {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { PageWrapper, ReaderMethodCtx, ReaderStateCtx } from "./Reader";
import {
  MoreOutlined,
  PlusOutlined,
  CopyOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import IconFont from "../ui/IconFont";
import {
  Draggable,
  Droppable,
  DropResult,
  DragDropContext,
} from "react-beautiful-dnd";
import "./preview.sass";
import { exchange } from "../../lib/array";
import { AddPageButton } from "./ReaderTools";
import { TeamCtx } from "./Team";
import classNames from "classnames";

const PageNavContent = ({
  activeKey,
  setActiveKey,
}: {
  activeKey: string;
  setActiveKey: Dispatch<SetStateAction<string>>;
}) => {
  const { pageOrder, inviewPages } = useContext(ReaderStateCtx);
  const { setPageOrder, scrollPage } = useContext(ReaderMethodCtx);
  const { updateReorder } = useContext(TeamCtx);

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !pageOrder) return;
    const { index: fromIndex } = source;
    const { index: toIndex } = destination;
    const pageId = pageOrder[fromIndex];
    setPageOrder((prev) => {
      if (!prev) return;
      const newOrder = exchange(prev, fromIndex, toIndex);
      updateReorder && updateReorder(newOrder);
      return newOrder;
    });
    requestAnimationFrame(() => scrollPage(pageId));
  };

  const currPageId = useMemo(
    () => pageOrder?.find((pageId) => inviewPages.has(pageId)) || "",
    [pageOrder, inviewPages]
  );

  return (
    <div className="preview-container">
      <PreviewTabs activeKey={activeKey} setActiveKey={setActiveKey} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {({ droppableProps, innerRef, placeholder }) => (
            <div className="pages" {...droppableProps} ref={innerRef}>
              {pageOrder?.map((uid, index) => (
                <PagePreview
                  key={uid}
                  uid={uid}
                  pageIndex={index}
                  mode={activeKey}
                  currPageId={currPageId}
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
  mode: string;
  currPageId: string;
}> = ({ uid, pageIndex, mode, currPageId }) => {
  const { stateSet, teamStateSet, pageRec } = useContext(ReaderStateCtx);
  const { scrollPage, switchPageMarked } = useContext(ReaderMethodCtx);
  const page = pageRec && pageRec[uid];
  const drawState = stateSet?.getOneState(uid);
  const teamState = teamStateSet?.getOneState(uid);
  if (!page || !drawState) return null;

  if (
    mode === "WRITTEN" &&
    drawState.isEmpty() &&
    (!teamState || teamState.isEmpty())
  ) {
    return null;
  } else if (mode === "MARKED" && !page.marked) {
    return null;
  }

  const switchMarked = (e: MouseEvent<HTMLSpanElement>) => {
    switchPageMarked(uid);
    e.stopPropagation();
  };
  const curr = currPageId === uid;
  const dragDisabled = mode !== "ALL";

  return (
    <Draggable
      draggableId={uid}
      index={pageIndex}
      isDragDisabled={dragDisabled}
    >
      {(
        { innerRef, draggableProps, dragHandleProps },
        { isDragging: drag }
      ) => {
        const { image, marked } = page;
        return (
          <div
            ref={innerRef}
            className={classNames("page", { curr, drag })}
            onClick={() => scrollPage(uid)}
            {...draggableProps}
            {...dragHandleProps}
          >
            <PageWrapper
              uid={uid}
              drawState={drawState}
              teamState={teamState}
              imageBlob={image}
              preview
            />
            <span
              className={classNames("bookmark", { marked })}
              onClickCapture={switchMarked}
            />
            <span className="index">{pageIndex + 1}</span>
            <PreviewOption uid={uid} />
          </div>
        );
      }}
    </Draggable>
  );
};

const PreviewOption = ({ uid }: { uid: string }) => {
  const [popShow, setPopShow] = useState(false);
  const { addPage, deletePage } = useContext(ReaderMethodCtx);
  const { teamOn } = useContext(ReaderStateCtx);
  const { Item } = Menu;

  const menu = (
    <Menu
      onClick={({ key, domEvent }) => {
        if (key === "ADD") {
          addPage(uid);
        } else if (key === "COPY") {
          addPage(uid, true);
        } else if (key === "DELETE") {
          deletePage(uid);
        }
        domEvent.stopPropagation();
        setPopShow(false);
      }}
    >
      <Item key="ADD" icon={<PlusOutlined />}>
        Add page
      </Item>
      <Item key="COPY" icon={<CopyOutlined />}>
        Duplicate
      </Item>
      <Item key="DELETE" danger icon={<DeleteOutlined />} disabled={teamOn}>
        Delete
      </Item>
    </Menu>
  );
  return (
    <Popover
      content={menu}
      trigger="click"
      placement="left"
      visible={popShow}
      onVisibleChange={setPopShow}
      destroyTooltipOnHide
    >
      <span
        className="option"
        onClickCapture={(e) => {
          setPopShow((prev) => !prev);
          e.stopPropagation();
        }}
      >
        <MoreOutlined />
      </span>
    </Popover>
  );
};

const PreviewTabs = ({
  activeKey,
  setActiveKey,
}: {
  activeKey: string;
  setActiveKey: (key: string) => void;
}) => {
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
    <>
      <Button
        type="text"
        icon={<MenuFoldOutlined />}
        onClick={() => setNavOn((prev) => !prev)}
      />
      <Drawer
        visible={navOn}
        onClose={() => setNavOn(false)}
        width={200}
        title={title}
        closeIcon={<MenuUnfoldOutlined />}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        forceRender
      >
        <PageNavContent activeKey={activeKey} setActiveKey={setActiveKey} />
      </Drawer>
    </>
  );
}
