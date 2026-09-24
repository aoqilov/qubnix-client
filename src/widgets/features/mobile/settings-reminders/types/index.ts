export interface ReminderItem {
  id: string;
  /** settings.reminders.* kaliti — matn render paytida olinadi. */
  titleKey: "settings.reminders.newTask" | "settings.reminders.projectManagement" | "settings.reminders.performance";
  descriptionKey: "settings.reminders.push";
  enabled: boolean;
}
