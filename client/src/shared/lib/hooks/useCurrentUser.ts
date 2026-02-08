import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "@shared/api";

interface JwtPayload {
  sub: string;
  unique_name: string;
  email: string;
}

export function getCurrentUserId(): string | null {
  const raw = getCookie("access_token");
  if (!raw) return null;

  const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}

export function useCurrentUser() {
  const token = getCookie("access_token");

  const userId = useMemo(() => {
    if (!token) return null;
    const jwt = token.startsWith("Bearer ") ? token.slice(7) : token;
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);
      return decoded.sub ?? null;
    } catch {
      return null;
    }
  }, [token]);

  return { userId };
}
