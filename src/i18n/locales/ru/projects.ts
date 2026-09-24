// /settings/projects va /settings/projects/:id.
const projects = {
  title: "Проекты",
  fallbackTitle: "Проект",
  search: "Поиск проектов",
  newProject: "Новый проект",
  loadError: "Не удалось загрузить проекты.",
  detailLoadError: "Не удалось загрузить проект.",
  empty: "Проектов пока нет",
  emptySearchHint: "Попробуйте изменить поиск",
  members: "Сотрудники",
  noMembers: "Сотрудники не добавлены",
  addMember: "Добавить сотрудника",
  allMembersAdded: "Все сотрудники уже добавлены",
  create: {
    nameLabel: "Название проекта",
    namePlaceholder: "Например, Редизайн",
    error: "Не удалось создать проект. Попробуйте ещё раз.",
  },
  edit: {
    title: "Изменить проект",
    error: "Не удалось сохранить изменения. Попробуйте ещё раз.",
  },
  delete: {
    title: "Удалить проект",
    deleting: "Удаление...",
    text: "Проект будет удалён вместе с задачами и привязками сотрудников. Это действие нельзя отменить.",
  },
  removeMember: {
    title: "Убрать сотрудника",
    textAfterName: "будет убран(а) из проекта. Изменение вступит в силу только после нажатия «{{save}}».",
  },
};

export default projects;
