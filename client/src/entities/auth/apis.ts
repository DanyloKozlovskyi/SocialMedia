import axios from "axios";
import { Login, Register } from "./interfaces";
import { ORIGIN, ENDPOINTS, getCookie } from "@shared/api";

const register = async ({ ...account }: Register) => {
  const response = await axios.post(
    `${ORIGIN}/${ENDPOINTS.ACCOUNT}/register`,
    account
  );
  return response?.data;
};

const login = async ({ ...account }: Login) => {
  const response = await axios.post(
    `${ORIGIN}/${ENDPOINTS.ACCOUNT}/login`,
    account
  );
  return response?.data;
};

const logout = async () => {
  const token = getCookie("access_token");
  const response = await axios.get(
    `${ORIGIN}/${ENDPOINTS.ACCOUNT}/logout`,
    { headers: { Authorization: token } }
  );
  return response?.data;
};

export { register, login, logout };
