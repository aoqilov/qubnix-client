import { usersApi } from "@/api/users/users.api";
import { readStoredInitData, useSessionStore } from "@/store/session.store";

// Saqlangan init_data bo'lsa — store'ga, interceptor uni `initdata` header qilib
// yuboradi. Bo'lmasa so'rov qubnix_session cookie bilan ketadi (login shu o'zgarishdan
// oldin qilingan eski sessiyalar; iOS'da bunday cookie yo'q). Ikkalasi ham yaroqsiz
// bo'lsa 401 keladi va interceptor sessiyani (saqlangan init_data bilan) tozalaydi.
export async function enterWayWeb(): Promise<void> {
  const storedInitData = readStoredInitData();
  if (storedInitData) useSessionStore.getState().setInitData(storedInitData);
  useSessionStore.getState().setStatus("authenticating");
  try {
    const user = await usersApi.me();
    useSessionStore.getState().setSession(user);
  } catch {
    useSessionStore.getState().setStatus("unauthenticated");
  }
}
