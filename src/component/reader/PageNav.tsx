import { Button, Drawer, Menu, Popover, Tabs } from "antd";
import React, {
  FC,
  useMemo,
  Dispatch,
  useState,
  useContext,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
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
import { AddPageButton } from "./ReaderTools";
import { exchange } from "../../lib/array";
import classNames from "classnames";
import { TeamCtx } from "./Team";
import "./preview.sass";

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
  const refRec = useRef<Record<string, HTMLElement>>({});
  const listEl = useRef<HTMLDivElement>();

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !pageOrder) return;
    const { index: fromIndex } = source;
    const { index: toIndex } = destination;
    const pageID = pageOrder[fromIndex];
    setPageOrder((prev) => {
      if (!prev) return;
      const newOrder = exchange(prev, fromIndex, toIndex);
      updateReorder && updateReorder(newOrder);
      return newOrder;
    });
    requestAnimationFrame(() => scrollPage(pageID));
  };

  const currpageID = useMemo(
    () => pageOrder?.find((pageID) => inviewPages.has(pageID)) || "",
    [pageOrder, inviewPages]
  );

  useEffect(() => {
    refRec.current[currpageID]?.scrollIntoView();
    const itemHeight = refRec.current[currpageID]?.clientHeight || 0;
    const listHeight = listEl.current?.clientHeight || 0;
    listEl.current?.scrollBy(0, -listHeight / 2 + itemHeight / 2);
  }, []);

  return (
    <div className="preview-container">
      <PreviewTabs activeKey={activeKey} setActiveKey={setActiveKey} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {({ droppableProps, innerRef, placeholder }) => (
            <div
              className="page-list"
              ref={(e) => {
                innerRef(e);
                if (e) listEl.current = e;
              }}
              {...droppableProps}
            >
              {pageOrder?.map((uid, index) => (
                <PagePreview
                  key={uid}
                  uid={uid}
                  mode={activeKey}
                  pageIndex={index}
                  currpageID={currpageID}
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
  mode: string;
  pageIndex: number;
  currpageID: string;
  refRec: Record<string, HTMLElement>;
}> = ({ uid, pageIndex, mode, currpageID, refRec }) => {
  const { stateSet, teamState, pageRec } = useContext(ReaderStateCtx);
  const { scrollPage, switchPageMarked } = useContext(ReaderMethodCtx);
  const page = pageRec && pageRec[uid];
  const drawState = stateSet?.getOneState(uid);
  const teamStateMap = teamState?.getOnePageState(uid);
  if (!page || !drawState) return null;

  if (
    mode === "WRITTEN" &&
    drawState.isEmpty() &&
    (!teamStateMap || teamStateMap.every((ds) => ds.isEmpty()))
  ) {
    return null;
  } else if (mode === "MARKED" && !page.marked) {
    return null;
  }

  const switchMarked = (e: MouseEvent<HTMLSpanElement>) => {
    switchPageMarked(uid);
    e.stopPropagation();
  };
  const curr = currpageID === uid;
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
            ref={(e) => {
              innerRef(e);
              if (e) refRec[uid] = e;
            }}
            className={classNames("page", { curr, drag })}
            onClick={() => scrollPage(uid)}
            {...draggableProps}
            {...dragHandleProps}
          >
            <PageWrapper
              uid={uid}
              drawState={drawState}
              teamStateMap={teamStateMap}
              thumbnail={image}
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
        destroyOnClose
      >
        <PageNavContent activeKey={activeKey} setActiveKey={setActiveKey} />
      </Drawer>
    </>
  );
}
