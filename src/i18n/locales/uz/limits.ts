import type limitsRu from "../ru/limits";

const limits: typeof limitsRu = {
  title: {
    projects: "Loyihalar limitiga yetildi",
    members: "Xodimlar limitiga yetildi",
    routines: "Takroriy vazifalar limitiga yetildi",
  },
  label: {
    projects: "Loyihalar",
    members: "Xodimlar va takliflar",
    routines: "Takroriy vazifalar",
  },
  description: "{{plan}} tarifida {{max}} tagacha ruxsat etiladi. Ko'proq qo'shish uchun yuqoriroq tarifga o'ting.",
  descriptionGeneric: "Tarifingiz limitiga yetdingiz. Ko'proq qo'shish uchun yuqoriroq tarifga o'ting.",
  ownerOnly: "Tarifni faqat tashkilot egasi oshira oladi.",
  upgrade: "Tarifni oshirish",
};

export default limits;
