import { useLocalStorage } from "../utils/useLocalStorage";
import { UserInfo } from "./type";

export function findLoginInfo(): UserInfo | null {
  const info: string | null = useLocalStorage("userInfo").value;

  return !!info ? JSON.parse(info) : null;
}
