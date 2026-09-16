export interface Workspace {
  id: string;
  name: string;
  tariffId: string;
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  currency: string;
}

/**
 * /doska ekranidagi workspace kartasi.
 * Rang bu yerda saqlanmaydi — utils/avatarColor.ts dagi avatarColorVar(id)
 * dan olinadi, shunda dark temada avtomatik moslashadi.
 */
export interface WorkspaceSummary {
  id: string;
  name: string;
  /** Avatar doirasidagi harf(lar). */
  initials: string;
  /** Karta ostidagi tashkilot nomi — "RZB Tech". */
  orgName: string;
  /** O'ngdagi belgidagi son — "4 задачи". */
  tasksCount: number;
  /** Desktop sidebar ishlatadi. */
  projectsCount: number;
  /** Desktop sidebar ishlatadi. */
  todayCount: number;
}

/** /doska ekranidagi "Личные задачи" kartasi. */
export interface PersonalSummary {
  tasksCount: number;
}

export interface CreateWorkspaceRequest {
  name: string;
  orgName: string;
}
