import type ru from "../ru";
import common from "./common";
import ui from "./ui";
import layout from "./layout";
import tasks from "./tasks";
import auth from "./auth";
import doska from "./doska";
import calendar from "./calendar";
import statistics from "./statistics";
import profile from "./profile";
import settings from "./settings";
import members from "./members";
import roles from "./roles";
import projects from "./projects";
import memberStats from "./memberStats";
import routines from "./routines";

/** `typeof ru` — kalit tushib qolsa yoki ortiqcha bo'lsa typecheck xato beradi. */
const uz: typeof ru = {
  common,
  ui,
  layout,
  tasks,
  auth,
  doska,
  calendar,
  statistics,
  profile,
  settings,
  members,
  roles,
  projects,
  memberStats,
  routines,
};

export default uz;
