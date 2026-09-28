import { isAxiosError } from "axios";

export function isAxiosUnauthorized(err: unknown): boolean {
  return isAxiosError(err) && err.response?.status === 401;
}
