import type ru from "../ru";
import common from "./common";
import ui from "./ui";
import layout from "./layout";
import tasks from "./tasks";

/** `typeof ru` — kalit tushib qolsa yoki ortiqcha bo'lsa typecheck xato beradi. */
const uz: typeof ru = {
  common,
  ui,
  layout,
  tasks,
};

export default uz;
