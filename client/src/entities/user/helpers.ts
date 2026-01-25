import { jwtDecode } from "jwt-decode";
import { getCookie } from "@shared/api";
import { JwtPayload } from "./interfaces";

export const getUserId = async (): Promise<string> => {
  const token = getCookie("access_token")?.split(" ")[1] ?? null;
  if (!token) return "";

  try {
    const { sub } = jwtDecode<JwtPayload>(token);
    return sub;
  } catch (exc) {
    console.error("Failed to decode JWT:", exc);
    return "";
  }
};
