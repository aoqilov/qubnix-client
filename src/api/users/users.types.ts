/** Backend /api/v1/users/me javobidagi xom (snake_case) shakl. */
export interface RawUser {
  id: number;
  telegram_id: string;
  telegram_username: string;
  telegram_first_name: string;
  telegram_last_name: string;
  telegram_avatar_url: string;
  first_name: string;
  last_name: string;
  index_quality: number;
  registered_at: string;
}
