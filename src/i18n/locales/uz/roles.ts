import type ru from "../ru/roles";

const roles: typeof ru = {
  title: "Rollar",
  scope: {
    organization: "Tashkilot",
    project: "Loyiha",
  },
  combineHint: "Loyihadagi rol tashkilotdagi rolga qo'shiladi: \"Loyiha menejeri\" bo'lgan xodim faqat o'z loyihalaridagi vazifalarni boshqaradi.",
  owner: {
    title: "Egasi",
    badge: "To'liq ruxsat",
    text: "Tashkilotni yaratgan. Hamma narsa mumkin — tashkilot nomi, tarif va obuna ham.",
  },
  admin: {
    title: "Admin",
    badge: "Deyarli hammasi",
    text: "Tashkilot ichidagi hamma narsani boshqaradi, faqat nomi va tarifidan tashqari.",
  },
  member: {
    title: "Xodim",
    badge: "Ijrochi",
    text: "O'ziga biriktirilgan vazifalarni ko'radi va bajaradi. Ko'proq huquqni loyihadagi rol beradi.",
  },
  viewer: {
    title: "Kuzatuvchi",
    badge: "Faqat ko'rish",
    text: "Admin ko'radigan hamma narsani ko'radi, lekin hech narsani o'zgartira olmaydi.",
  },
  projectManager: {
    title: "Loyiha menejeri",
    badge: "O'z loyihalarida",
    text: "Aniq loyihaga (yoki bir nechtasiga) tayinlanadi va undagi vazifalarni yuritadi.",
  },
  projectMember: {
    title: "Loyiha ishtirokchisi",
    badge: "Ijrochi",
    text: "Loyihada o'ziga biriktirilgan vazifalarni bajaradi.",
  },
  perms: {
    viewAll: "Barcha loyiha, vazifa va xodimlarni ko'radi",
    doTasks: "Vazifa statusini o'zgartiradi, subtasklarni belgilaydi",
    manageTasks: "Vazifa yaratadi, tahrirlaydi va o'chiradi",
    manageProjects: "Loyiha yaratadi, tahrirlaydi va o'chiradi",
    manageMembers: "Xodim taklif qiladi, rolini o'zgartiradi, o'chiradi",
    manageRoutines: "Takrorlanuvchi vazifalarni boshqaradi",
    viewStats: "Xodimlar statistikasini ko'radi",
    notifications: "O'z bildirishnomalarini sozlaydi",
    renameOrg: "Tashkilot nomini o'zgartiradi",
    billing: "Tarif va obunani boshqaradi",
    manageProjectTasks: "O'z loyihasida vazifa yaratadi, tahrirlaydi va o'chiradi",
    filterByMember: "Vazifalarni xodim bo'yicha filtrlaydi",
    manageProjectMembers: "Loyihaga xodim qo'shadi va olib tashlaydi",
  },
};

export default roles;
