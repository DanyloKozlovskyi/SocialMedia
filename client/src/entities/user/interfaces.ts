interface UpdateUser {
  logoKey: string | null;
  logoContentType: string | null;
  name: string;
  description: string | null;
}

interface User extends UpdateUser {
  id: string;
  userName: string;
}

interface JwtPayload {
  sub: string;
  // exp?: number;
  // iat?: number;
}

export type { UpdateUser, User, JwtPayload };
