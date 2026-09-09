import { isTelegramMiniApp } from "@/utils/platform";
import { enterWayTelegram } from "./enter-way.telegram";
import { enterWayWeb } from "./enter-way.web";

export async function enterWay(): Promise<void> {
  if (isTelegramMiniApp()) {
    await enterWayTelegram();
  } else {
    await enterWayWeb();
  }
}
