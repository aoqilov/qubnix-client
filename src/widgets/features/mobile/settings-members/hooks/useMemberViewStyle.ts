import { useState } from "react";

export type MemberViewStyle = "list" | "card";

const STORAGE_KEY = "member-view-style";

function readStored(): MemberViewStyle {
  return localStorage.getItem(STORAGE_KEY) === "card" ? "card" : "list";
}

export function useMemberViewStyle() {
  const [viewStyle, setViewStyleState] = useState<MemberViewStyle>(readStored);

  const setViewStyle = (style: MemberViewStyle) => {
    localStorage.setItem(STORAGE_KEY, style);
    setViewStyleState(style);
  };

  return [viewStyle, setViewStyle] as const;
}
