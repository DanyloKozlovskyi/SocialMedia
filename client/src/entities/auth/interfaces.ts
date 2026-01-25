interface Login {
  email: string;
  password: string;
}

interface Register extends Login {
  userName: string;
  phoneNumber: string;
  confirmPassword: string;
}

interface AuthenticationResponse {
  token: string;
  refreshToken: string;
}

export type { Login, Register, AuthenticationResponse };
