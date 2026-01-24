import { AuthenticationResponse } from "./interfaces";
import { setCookie } from "@shared/api";

const saveTokens = ({ token, refreshToken }: AuthenticationResponse) => {
  setCookie("access_token", `Bearer ${token}`);
  setCookie("refresh_token", `Bearer ${refreshToken}`);
};

export { saveTokens };
