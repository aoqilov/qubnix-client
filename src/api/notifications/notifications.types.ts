/** Joriy foydalanuvchining shu tashkilotdagi bildirishnoma sozlamalari. */
export interface NotificationSettings {
  new_task: boolean;
  deadline_10_min: boolean;
  task_completed: boolean;
  task_overdue: boolean;
}

/** PATCH — faqat o'zgargan maydonlarni yuborish mumkin. */
export type UpdateNotificationSettingsRequest = Partial<NotificationSettings>;
