// /doska — workspace tanlash ekrani, taklifnomalar, yangi tashkilot.
const doska = {
  title: "Где будем работать?",
  sections: {
    personal: "Личное",
    organizations: "Организации",
  },
  listError: "Не удалось загрузить список. Обновите страницу.",
  personal: {
    title: "Личные задачи",
    today: "Сегодня {{label}}",
  },
  addOrganization: "Новая организация",
  invitations: {
    button: "Приглашения",
    title: "Приглашения",
    loadError: "Не удалось загрузить приглашения.",
    empty: "Пока нет новых приглашений",
    from: "От {{name}}",
    daysAgo: "{{count}} дн. назад",
    projects: "Проекты ({{count}})",
    reject: "Отклонить",
    accept: "Принять",
  },
  createOrganization: {
    title: "Новая организация",
    nameLabel: "Название",
    namePlaceholder: "Например, Synapse",
    error: "Не удалось создать организацию. Попробуйте ещё раз.",
  },
};

export default doska;
