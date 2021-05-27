import { UserInfo } from "./type";

export function findLoginInfo(): UserInfo | null {
  const info: string | null = localStorage.getItem("userInfo");
  return !!info ? JSON.parse(info) : null;
}
