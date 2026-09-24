import type ru from "../ru/profile";

const profile: typeof ru = {
  title: "Profil",
  description: "Hisob va sozlamalar",
  settings: "Sozlamalar",
  editProfile: "Profilni tahrirlash",
  edit: {
    changePhoto: "Rasmni almashtirish",
    changePhotoHint: "Rasmni almashtirish uchun kamera belgisini bosing",
    fullName: "Ism familiya",
    phone: "Telefon raqam",
  },
  prefs: {
    mode: "Rejim",
    light: "Yorug'",
    dark: "Qorong'u",
    language: "Til",
    fontSize: "Shrift kattaligi",
    fontSm: "Kichik",
    fontMd: "O'rta",
    fontLg: "Katta",
  },
  tariffs: {
    section: "TARIFLAR",
    mine: "Mening tariflarim",
    list: "Tariflar va narxlar",
    loadError: "Tariflarni olishda xatolik yuz berdi",
    choose: "Tanlash",
    until: "{{date}} gacha",
    proDescription: "Cheklovsiz vazifa va loyihalar",
  },
};

export default profile;
