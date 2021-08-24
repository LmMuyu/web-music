import { useLocalStorage } from "../utils/useLocalStorage";
import { UserInfo } from "./type";

export function findLoginInfo(): UserInfo | Object {
  const info: string | null = useLocalStorage("userinfo").value;

  return !!info ? JSON.parse(info) : {};
}
