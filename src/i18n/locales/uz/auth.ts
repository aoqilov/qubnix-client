import type ru from "../ru/auth";

const auth: typeof ru = {
  subtitle: "Hisobingizga kiring yoki Telegram orqali ro'yxatdan o'ting",
  tabs: {
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
  },
  phone: {
    label: "Telefon raqami",
    helper: "Tasdiqlash kodi shu raqamga bog'langan Telegram akkauntingizga yuboriladi",
    incomplete: "Telefon raqamini to'liq kiriting",
    sendFailed: "Kod yuborilmadi, qayta urining",
    send: "Jo'natish",
  },
  userNotFound: {
    title: "Foydalanuvchi topilmadi",
    text: "Bu raqam bilan hech kim ro'yxatdan o'tmagan. Avval Telegram bot orqali ro'yxatdan o'ting.",
  },
  code: {
    sentBefore: "Tasdiqlash kodini Telegram ilovangizdagi",
    sentAfter: "ga jo'natdik — kodni o'sha yerdan olishingiz mumkin.",
    openBot: "Botni ochish",
    label: "Tasdiqlash kodi",
    mustBeSix: "Kod 6 xonali bo'lishi kerak",
    invalid: "Tasdiqlash kodi noto'g'ri",
    validFor: "Kod amal qilish muddati: {{time}}",
    expired: "Kod muddati tugadi — yangisini so'rang",
    sessionExpired: "Tasdiqlash muddati tugadi, raqamni qaytadan yuboring",
    checking: "Tekshirilmoqda...",
    resend: "Kodni qayta jo'natish",
    changePhone: "Raqamni o'zgartirish",
  },
  register: {
    introBefore: "Tugmani bossangiz",
    introAfter: "yangi oynada ochiladi.",
    step1: "Quyidagi tugma orqali botni oching",
    step2: "Botda «Start» bosing va telefon raqamingizni ulashing",
    step3: "Ro'yxatdan o'tgach, shu yerga qaytib «Kirish» orqali kiring",
    button: "Telegram bot orqali ro'yxatdan o'tish",
  },
};

export default auth;
