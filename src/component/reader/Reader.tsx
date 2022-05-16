import React, {
  FC,
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
  useLayoutEffect,
} from "react";
import {
  DrawCtrl,
  getDrawCtrl,
  defaultDrawCtrl,
} from "../../lib/draw/drawCtrl";
import {
  createPage,
  defaultNotePage,
  NoteInfo,
  NotePage,
} from "../../lib/note/note";
import { NewPageInfo, ReorderInfo, SyncInfo } from "../../lib/network/io";
import { SetOperation, StateSet } from "../../lib/draw/StateSet";
import { loadNote, editNoteData } from "../../lib/note/archive";
import { AddPageButton, showPageDelMsg } from "./ReaderTools";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { DrawState } from "../../lib/draw/DrawState";
import { updatePages } from "../../lib/network/http";
import { useBeforeunload } from "react-beforeunload";
import { TeamState } from "../../lib/draw/TeamState";
import { Setter, useMounted } from "../../lib/hooks";
import { insertAfter } from "../../lib/array";
import { debounce, last, once } from "lodash";
import SelectTool from "../draw/SelectTool";
import { Map, Set } from "immutable";
import DrawTools from "./DrawTools";
import { TeamCtx } from "./Team";
import Draw from "../draw/Draw";
import { message } from "antd";
import "./reader.sass";

export const ReaderStateCtx = createContext({
  noteID: "",
  noteInfo: undefined as NoteInfo | undefined,
  stateSet: undefined as StateSet | undefined,
  teamState: undefined as TeamState | undefined,
  pageRec: undefined as Map<string, NotePage> | undefined,
  pageOrder: undefined as string[] | undefined,
  saved: true,
  teamOn: false,
  inviewPages: Set<string>(),
  drawCtrl: defaultDrawCtrl,
});

export const ReaderMethodCtx = createContext({
  scrollPage: (pageID: string) => {},
  switchPageMarked: (pageID: string) => {},
  updateStateSet: (cb: (prevSS: StateSet) => StateSet) => {},
  addPage: (prevPageID: string, copy?: boolean) => {},
  addFinalPage: () => {},
  deletePage: (pageID: string) => {},
  saveReorder: async (order: string[], push: boolean) => {},
  setInviewPages: (() => {}) as Setter<Set<string>>,
  setDrawCtrl: (() => {}) as Setter<DrawCtrl>,
});

export default function Reader({ teamOn }: { teamOn: boolean }) {
  const noteID = useParams().noteID ?? "";
  const nav = useNavigate();

  const [pageRec, setPageRec] = useState<Map<string, NotePage>>();
  const [noteInfo, setNoteInfo] = useState<NoteInfo>();
  const [stateSet, setStateSet] = useState<StateSet>();
  const [drawCtrl, setDrawCtrl] = useState(defaultDrawCtrl);
  const [inviewPages, setInviewPages] = useState(Set<string>());
  const [pageOrder, setPageOrder] = useState<string[]>();
  const [saved, setSaved] = useState(true);

  const refRec = useRef<Record<string, HTMLElement>>({});
  const mounted = useMounted();

  const { io, teamState, addTeamStatePage } = useContext(TeamCtx);

  useEffect(() => {
    const loadNotePages = async () => {
      const storedNote = await loadNote(noteID);
      if (!storedNote) {
        message.error("Note not found");
        return nav("/");
      }
      const { pageRec, pdf, pageOrder, ...noteInfo } = storedNote;
      setPageRec(Map(pageRec));
      setPageOrder(pageOrder);
      setNoteInfo(noteInfo);
      setStateSet(StateSet.createFromPages(pageRec));
      setDrawCtrl(await getDrawCtrl());
      if (teamOn) updatePages(noteID);
    };
    loadNotePages();
  }, [nav, noteID, teamOn]);

  const saverRef = useRef(async () => {});
  saverRef.current = async () => {
    const pr = pageRec?.toObject();
    const canvas = document.querySelector("canvas");
    const data = canvas?.toDataURL();
    await editNoteData(noteID, { pageRec: pr, thumbnail: data });
    mounted.current && setSaved(true);
  };
  useLayoutEffect(() => () => void saverRef.current(), []);
  useBeforeunload(() => saverRef.current());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(() => saverRef.current(), 2000),
    []
  );

  const savePageRec = useCallback(
    (pageID: string, cb: (prev: NotePage) => NotePage) => {
      setPageRec((prev) => prev?.update(pageID, defaultNotePage, cb));
      setSaved(false);
      debouncedSave();
    },
    [debouncedSave]
  );

  const pushReorder = useCallback(
    (pageOrder: string[]) => io?.emit("reorder", { pageOrder }),
    [io]
  );

  const saveReorder = useCallback(
    async (newOrder: string[], push = false) => {
      setPageOrder(newOrder);
      await editNoteData(noteID, { pageOrder: newOrder });
      await saverRef.current();
      push && pushReorder(newOrder);
    },
    [noteID, pushReorder]
  );

  useEffect(() => {
    if (!noteInfo) return;
    document.title = noteInfo.name + " - Multibility";
  }, [noteInfo]);

  useEffect(() => {
    if (!io) return;
    io.on("reorder", ({ deleted, pageOrder, prevOrder }: ReorderInfo) => {
      saveReorder(pageOrder);
      if (deleted) showPageDelMsg(() => saveReorder(prevOrder, true));
    });

    io.on("newPage", ({ pageOrder, pageID, newPage }: NewPageInfo) => {
      saveReorder(pageOrder);
      savePageRec(pageID, () => newPage);
      setStateSet((prev) => prev?.addState(pageID, newPage));
    });

    return () => void io.removeAllListeners();
  }, [io, savePageRec, saveReorder]);

  const pushOperation = useCallback(
    (operation: SetOperation) => {
      const handleSync = ({ stroke, pageID }: SyncInfo) =>
        setStateSet((prevSS) =>
          prevSS?.updateState(pageID, (prevDS) =>
            DrawState.updateStroke(prevDS, stroke)
          )
        );

      io?.emit("push", { operation }, handleSync);
    },
    [io]
  );

  const pushNewPage = (
    pageOrder: string[],
    pageID: string,
    newPage: NotePage
  ) => {
    const { image, marked, ...newTeamPage } = newPage;
    io?.emit("newPage", { pageOrder, pageID, newPage: newTeamPage });
    addTeamStatePage(pageID, newPage);
  };

  const updatePageRec = useCallback(
    (pageID: string, ds: DrawState) => {
      const state = DrawState.flaten(ds);
      savePageRec(pageID, (prev) => ({ ...prev, state }));
    },
    [savePageRec]
  );

  const ssRef = useRef(stateSet);
  ssRef.current = stateSet;
  const updateStateSet = useCallback(
    (cb: (prevSS: StateSet) => StateSet) => {
      if (!ssRef.current) return;
      const newSS = cb(ssRef.current);
      setStateSet(newSS);
      const lastDS = newSS.getLastDS();
      const lastOp = newSS.lastOp;
      if (!lastDS || !lastOp) return;
      updatePageRec(...lastDS);
      pushOperation(lastOp);
    },
    [updatePageRec, pushOperation]
  );

  const switchPageMarked = (pageID: string) => {
    savePageRec(pageID, (prev) => ({ ...prev, marked: !prev.marked }));
  };

  const scrollPage = (pageID: string) => {
    refRec.current[pageID]?.scrollIntoView();
  };

  const addPage = (prevPageID: string, copy = false) => {
    if (!pageOrder) return;
    const prevPage = copy ? pageRec?.get(prevPageID) : undefined;
    const [pageID, newPage] = createPage(prevPage);
    const newOrder = insertAfter(pageOrder, prevPageID, pageID);
    pushNewPage(newOrder, pageID, newPage);
    saveReorder(newOrder);
    savePageRec(pageID, () => newPage);
    setStateSet((prev) => prev?.addState(pageID, newPage));
  };

  const addFinalPage = () => {
    const lastPageID = last(pageOrder);
    lastPageID && addPage(lastPageID);
  };

  const deletePage = (pageID: string) => {
    const newOrder = pageOrder?.filter((id) => id !== pageID);
    newOrder?.length && saveReorder(newOrder, true);
  };

  const renderResult = (
    <div className="reader container">
      <DrawTools
        handleUndo={() => updateStateSet((prev) => prev.undo())}
        handleRedo={() => updateStateSet((prev) => prev.redo())}
        instantSave={saverRef.current}
      />
      <main>
        {pageOrder?.map((uid) => (
          <section
            key={uid}
            className="note-page"
            ref={(e) => e && (refRec.current[uid] = e)}
          >
            <PageContainer uid={uid} />
          </section>
        ))}
        <AddPageButton />
      </main>
    </div>
  );

  return (
    <ReaderStateCtx.Provider
      value={{
        saved,
        teamOn,
        noteID,
        pageRec,
        drawCtrl,
        noteInfo,
        stateSet,
        teamState,
        pageOrder,
        inviewPages,
      }}
    >
      <ReaderMethodCtx.Provider
        value={{
          addPage,
          scrollPage,
          deletePage,
          setDrawCtrl,
          saveReorder,
          addFinalPage,
          updateStateSet,
          setInviewPages,
          switchPageMarked,
        }}
      >
        {renderResult}
      </ReaderMethodCtx.Provider>
    </ReaderStateCtx.Provider>
  );
}

const PageContainer: FC<{ uid: string }> = ({ uid }) => {
  const { pageRec, stateSet, teamState } = useContext(ReaderStateCtx);
  const { updateStateSet } = useContext(ReaderMethodCtx);

  const page = pageRec?.get(uid);
  const drawState = stateSet?.getOneState(uid);
  const teamStateMap = teamState?.getOnePageStateMap(uid);
  const updateState = useCallback(
    (ds: DrawState) => updateStateSet((prev) => prev.setState(uid, ds)),
    [uid, updateStateSet]
  );

  if (!page || !drawState) return null;
  return (
    <PageWrapper
      drawState={drawState}
      teamStateMap={teamStateMap}
      updateState={updateState}
      pdfIndex={page.pdfIndex}
      uid={uid}
    />
  );
};

export const PageWrapper = ({
  thumbnail,
  drawState,
  teamStateMap,
  updateState,
  pdfIndex,
  preview = false,
  uid,
}: {
  uid: string;
  drawState: DrawState;
  teamStateMap?: Map<string, DrawState>;
  thumbnail?: string;
  pdfIndex?: number;
  updateState?: (ds: DrawState) => void;
  preview?: boolean;
}) => {
  const { setInviewPages } = useContext(ReaderMethodCtx);
  const { noteID } = useContext(ReaderStateCtx);
  const [fullImg, setFullImg] = useState<string>();
  const [visibleRef, visible] = useInView({ delay: 100 });

  const { height, width } = drawState;
  const ratio = height / width;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadImage = useCallback(
    once(async () => {
      if (!pdfIndex) return;
      const { getOnePageImage } = await import("../../lib/note/pdfImage");
      setFullImg(await getOnePageImage(noteID, pdfIndex));
    }),
    [pdfIndex, noteID]
  );

  useEffect(() => {
    if (preview) return;
    if (visible) {
      loadImage();
      setInviewPages((prev) => prev.add(uid));
    } else {
      setInviewPages((prev) => prev.delete(uid));
    }
  }, [visible, preview, uid, loadImage, setInviewPages]);

  const { ignores } = useContext(TeamCtx);
  const otherStates = useMemo(
    () => teamStateMap?.deleteAll(ignores).toList().toArray(),
    [teamStateMap, ignores]
  );

  const imageLoaded = fullImg || !pdfIndex;
  const drawShow = visible && imageLoaded;
  const maskShow = Boolean(preview || !drawShow);

  return (
    <div ref={visibleRef} style={{ paddingTop: `${ratio * 100}%` }}>
      {drawShow && (
        <DrawWrapper
          drawState={drawState}
          otherStates={otherStates}
          updateState={updateState}
          imgSrc={fullImg || thumbnail}
          preview={preview}
        />
      )}
      {maskShow && <div className="mask" />}
    </div>
  );
};
PageWrapper.displayName = "PageWrapper";

const DrawWrapper = ({
  drawState,
  updateState,
  otherStates,
  preview = false,
  imgSrc,
}: {
  drawState: DrawState;
  otherStates?: DrawState[];
  updateState?: (ds: DrawState) => void;
  preview?: boolean;
  imgSrc?: string;
}) => {
  const { drawCtrl } = useContext(ReaderStateCtx);

  const dsRef = useRef(drawState);
  dsRef.current = drawState;
  const handleChange = useCallback(
    (arg: ((s: DrawState) => DrawState) | DrawState) => {
      if (!updateState) return;
      const newDS = arg instanceof DrawState ? arg : arg(dsRef.current);
      updateState(newDS);
    },
    [updateState]
  );

  return preview ? (
    <Draw
      drawState={drawState}
      otherStates={otherStates}
      imgSrc={imgSrc}
      readonly
      preview
    />
  ) : (
    <Draw
      drawState={drawState}
      otherStates={otherStates}
      onChange={handleChange}
      imgSrc={imgSrc}
      drawCtrl={drawCtrl}
      SelectTool={SelectTool}
    />
  );
};
DrawWrapper.displayName = "DrawWrapper";
