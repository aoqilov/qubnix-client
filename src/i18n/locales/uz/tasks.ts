import type ru from "../ru/tasks";

const tasks: typeof ru = {
  card: {
    subtasks: "Kichik vazifalar",
    photos: "Rasmlar",
    files: "Fayllar",
    addTask: "Vazifa qo'shish",
    noDeadline: "Muddatsiz",
  },
  stats: {
    done: "Topshirildi",
    completed: "Bajarildi",
    inProgress: "Jarayonda",
    overdue: "Muddati o'tgan",
  },
  subtask: {
    revertTitle: "Bandni qaytarish",
    revertText:
      "Siz bu bandni bajarib bo'lgansiz. Uni qayta bajarilmagan holatga qaytarishni istaysizmi?",
  },
  avatars: {
    more: "yana {{count}}",
    assigned: "Biriktirilgan xodimlar",
    legendSent: "— vazifa yaratildi",
    legendSeen: "— xodim ko'rdi",
  },
  assignees: {
    empty: "Xodimlar topilmadi",
  },
  steps: {
    step: "{{step}}/2-qadam",
    main: "Asosiy",
    extra: "Qo'shimcha",
  },
  modal: {
    titleAdd: "Yangi vazifa",
    titleEdit: "Vazifani tahrirlash",
    nameLabel: "Vazifa nomi",
    namePlaceholder: "Nomini yozing",
    description: "Tavsif",
    descriptionText: "Matn",
    descriptionVoice: "Ovoz",
    descriptionPlaceholder: "Vazifa haqida qisqacha ma'lumot",
    dueToday: "Bugunlik",
    dueFuture: "Kelajak kunlari",
    dueDeadline: "Muddat",
    pickDate: "Sanani tanlash",
    quickTime: "Tezkor vaqt tanlash",
    customTime: "O'zi belgilash",
    pickTimeTitle: "Vaqtni tanlang",
    datePlaceholder: "Sana",
    pickDateTitle: "Sanani tanlang",
    time: "Vaqt",
    members: "Xodimlar",
    priority: "Muhimlik",
    subtasks: "Qo'shimcha vazifalar - sub-task",
    subtaskPlaceholder: "Yangi Sub-Task",
    files: "Fayllar",
    summaryTask: "Vazifa",
    summaryAssignee: "Mas'ul",
    summaryDue: "Bajarish muddati",
  },
  delete: {
    title: "Vazifani o'chirish",
    text: "Bu vazifa butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.",
  },
  voice: {
    micDenied: "Mikrofonga ruxsat berilmadi",
    stop: "To'xtatish",
    play: "Tinglash",
    recorded: "Ovozli izoh yozildi",
    deleteVoice: "Ovozli izohni o'chirish",
    ready: "Ovozli izoh tayyor",
    accept: "Qabul qilish",
    recordingRelease: "Yozib olinmoqda — qo'yib yuboring",
    holdToRecord: "Bosib turib yozib oling",
    recordingHint: "Yozib olinmoqda — to'xtatish uchun qo'yib yuboring",
    holdHint: "Yozib olish uchun mikrofonni bosib turing",
  },
};

export default tasks;
