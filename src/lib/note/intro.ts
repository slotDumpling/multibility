import { createNewNote } from "./archive";
import { createEmptyNote } from "./note";

export async function createIntroNote() {
  const key = "INTRO_CREATED";
  if (localStorage.getItem(key)) return;

  const note = createEmptyNote();
  note.name = "Welcome to Multibility!";

  const firstPageRec = Object.values(note.pageRec)[0];
  if (!firstPageRec) return;
  const { default: state } = await import("./introState.json");
  firstPageRec.state = JSON.parse(state);
  localStorage.setItem(key, "CREATED");
  return await createNewNote(note);
}
