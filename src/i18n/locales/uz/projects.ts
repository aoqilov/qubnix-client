import type ru from "../ru/projects";

const projects: typeof ru = {
  title: "Loyihalar",
  fallbackTitle: "Loyiha",
  search: "Loyihalarni qidirish",
  newProject: "Yangi loyiha",
  loadError: "Loyihalarni yuklab bo'lmadi.",
  detailLoadError: "Loyihani yuklab bo'lmadi.",
  empty: "Loyihalar hali yo'q",
  emptySearchHint: "Qidiruvni o'zgartirib ko'ring",
  members: "Xodimlar",
  noMembers: "Xodimlar qo'shilmagan",
  addMember: "Xodim qo'shish",
  allMembersAdded: "Barcha xodimlar allaqachon qo'shilgan",
  create: {
    nameLabel: "Loyiha nomi",
    namePlaceholder: "Masalan, Redizayn",
    error: "Loyihani yaratib bo'lmadi. Qaytadan urinib ko'ring.",
  },
  edit: {
    title: "Loyihani tahrirlash",
    error: "O'zgarishlarni saqlab bo'lmadi. Qaytadan urinib ko'ring.",
  },
  delete: {
    title: "Loyihani o'chirish",
    deleting: "O'chirilmoqda...",
    text: "Loyiha, vazifalari va a'zo bog'lanishlari bilan birga butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.",
  },
  removeMember: {
    title: "Xodimni olib tashlash",
    textAfterName: "shu loyihadan olib tashlanadi. O'zgarish faqat \"{{save}}\" bosilgandan keyin kuchga kiradi.",
  },
};

export default projects;
