import type ru from "../ru/members";

const members: typeof ru = {
  title: "Xodimlar",
  usersCount: "{{name}} - {{label}}",
  tabs: {
    general: "Umumiy",
    invites: "Taklifnomalar",
  },
  loadError: "Xodimlarni yuklab bo'lmadi.",
  invitesLoadError: "Taklifnomalarni yuklab bo'lmadi.",
  addPerson: "Odam qo'shish",
  since: "{{count}} kundan beri",
  sentAgo: "{{count}} kun oldin",
  unknownUser: "Foydalanuvchi",
  projectsCount: "Loyihalar ({{count}})",
  cancelInvite: "Bekor qilish",
  toolbar: {
    search: "Xodimlarni qidirish",
    list: "Ro'yxat",
    cards: "Kartalar",
    allRoles: "Barchasi",
  },
  cancelDialog: {
    title: "Taklifni bekor qilish",
    cancelling: "Bekor qilinmoqda...",
    confirm: "Ha, bekor qilish",
    question: "{{name}}ga yuborilgan taklifni bekor qilasizmi?",
    warning:
      "Bu amalni ortga qaytarib bo'lmaydi — qayta taklif qilish uchun yangidan yuborishingiz kerak bo'ladi.",
    error: "Bekor qilib bo'lmadi. Qayta urinib ko'ring.",
  },
  invite: {
    title: "Odam qo'shish",
    send: "Taklif yuborish",
    searchLabel: "Telefon yoki Telegram username",
    searchPlaceholder: "+998 90 123 45 67 yoki @username",
    minChars: "Kamida 3 ta belgi kiriting",
    searching: "Qidirilmoqda...",
    searchError: "Qidiruvda xatolik yuz berdi. Qayta urinib ko'ring.",
    notFound: "Foydalanuvchi topilmadi. U avval botga ro'yxatdan o'tgan bo'lishi kerak.",
    role: "Rol",
    attachProjects: "Loyihalarga biriktirish (ixtiyoriy)",
    chooseProject: "Loyiha tanlang",
    addProject: "Loyiha qo'shish",
    sendError: "Taklif yuborilmadi. Qayta urinib ko'ring.",
  },
  actions: {
    title: "Xodim",
    role: "Rol",
    roleError: "Rolni o'zgartirib bo'lmadi.",
    removeQuestion: "{{name}}ni tashkilotdan chiqarishni tasdiqlaysizmi?",
    removeError: "O'chirib bo'lmadi. Qayta urinib ko'ring.",
    confirmRemove: "Ha, o'chirish",
  },
};

export default members;
