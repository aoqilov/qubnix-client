/**
 * Ruscha son kelishigi: 1 задача, 2 задачи, 5 задач.
 *
 * Qoida: oxirgi ikki xona 11-14 bo'lsa — doim ko'plik ("задач"); aks holda
 * oxirgi xona 1 → birlik, 2-4 → ikkilik shakl, qolgani → ko'plik.
 */
function pluralRu(count: number, one: string, few: string, many: string): string {
  const abs = Math.abs(count) % 100;
  if (abs >= 11 && abs <= 14) return many;

  switch (abs % 10) {
    case 1:
      return one;
    case 2:
    case 3:
    case 4:
      return few;
    default:
      return many;
  }
}

/** "4 задачи" */
export function tasksLabel(count: number): string {
  return `${count} ${pluralRu(count, "задача", "задачи", "задач")}`;
}

/** "3 организации" */
export function orgsLabel(count: number): string {
  return `${count} ${pluralRu(count, "организация", "организации", "организаций")}`;
}
