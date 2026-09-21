/** Backend /api/v1/users/me javobidagi xom (snake_case) shakl. */
export interface RawUser {
  id: number;
  telegram_id: string;
  telegram_username: string | null;
  telegram_first_name: string;
  telegram_last_name: string | null;
  telegram_avatar_url: string | null;
  first_name: string;
  last_name: string;
  index_quality: number;
  registered_at: string;
}
