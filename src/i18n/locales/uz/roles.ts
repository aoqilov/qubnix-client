import type ru from "../ru/roles";

const roles: typeof ru = {
  title: "Rollar",
  scope: {
    organization: "Tashkilot",
    project: "Loyiha",
  },
  owner: {
    title: "Egasi",
    badge: "To'liq ruxsat",
    text: "Workspace ustidan to'liq nazorat: tarif va to'lov, xodimlar, rollar, loyihalar — tashkilotning o'zini o'chirish ham.",
  },
  admin: {
    title: "Admin",
    badge: "Deyarli hammasi",
    text: "Workspace ichidagi hamma narsani boshqaradi — xodimlar, rollar, loyihalar, vazifalar. Faqat tashkilotning o'zini o'chira olmaydi.",
  },
  member: {
    title: "Xodim",
    text: "Tashkilotning oddiy xodimi. U qatnashadigan loyihalarda o'ziga biriktirilgan vazifalarni ko'radi va bajaradi.",
  },
  viewer: {
    title: "Kuzatuvchi",
    badge: "Faqat ko'rish",
    text: "Admin ko'radigan hamma narsani ko'radi, lekin hech narsani o'zgartira olmaydi — hech qanday amal yo'q, faqat ko'rish.",
  },
  projectManager: {
    title: "Loyiha menejeri",
    badge: "O'z loyihalarida",
    text: "Aniq loyihaga (yoki bir nechtasiga) tayinlanadi. Vazifalarni yaratishi, tahrirlashi va o'chirishi mumkin — faqat o'z loyihalarida.",
  },
  projectMember: {
    title: "Loyiha ishtirokchisi",
    badge: "Ijrochi",
    text: "Faqat ijrochi — loyihada o'ziga biriktirilgan vazifalarni bajaradi. Vazifa yarata yoki o'chira olmaydi.",
  },
};

export default roles;
