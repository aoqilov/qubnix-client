import type ru from "../ru/ui";

const ui: typeof ru = {
  calendar: {
    monthPlaceholder: "Oy YYYY",
    datePlaceholder: "KK.OO.YYYY",
    singleDay: "Bir kunlik",
    range: "Oraliq kunlarni belgilash",
    rangeFrom: "Dan",
    rangeTo: "Gacha",
    pickDate: "Sanani tanlang",
  },
  timepicker: {
    placeholder: "SS:DD",
    hoursShort: "Soat",
    minutesShort: "Daq",
    secondsShort: "Son",
    hours: "Soat",
    minutes: "Daqiqa",
    seconds: "Soniya",
    ok: "OK",
    pickTime: "Vaqtni tanlang",
  },
  fileUpload: {
    dropHere: "Faylni shu yerga tashlang",
    maxFiles: "Ko'pi bilan {{count}} ta fayl",
    orChoose: "yoki tanlang",
    chooseFiles: "Fayllarni tanlash",
    chooseFile: "Faylni tanlash",
    current: "Joriy",
  },
  pagination: {
    perPage: "Sahifada:",
    totalPages: "Jami sahifalar: {{count}}",
    prev: "Oldingi sahifa",
    next: "Keyingi sahifa",
    page: "{{page}}-sahifa",
  },
  table: {
    empty: "Ma'lumot topilmadi",
  },
  select: {
    placeholder: "Tanlang",
  },
  drawer: {
    back: "Orqaga",
    close: "Yopish",
  },
  toaster: {
    printing: "Chek chop etilmoqda...",
  },
  dialogDelete: {
    title: "O'chirishni tasdiqlang",
    titleShort: "O'chirilsinmi?",
    description: "Bu amalni ortga qaytarib bo'lmaydi.",
    deleting: "O'chirilmoqda...",
  },
};

export default ui;
