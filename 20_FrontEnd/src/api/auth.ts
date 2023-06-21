import AuthLoginResponse from "@/model/response/auth-login";
import axios from "axios";

export async function loginAsync(email: string, password: string): Promise<AuthLoginResponse> {
  const response = await axios.post<AuthLoginResponse>(`/api/auth/login`, {
    email: email,
    password: password,
  });
  return response.data;
}


export async function registUserAsync(email: string, password: string, userName: string): Promise<AuthLoginResponse> {
    const response = await axios.post<AuthLoginResponse>(`/api/auth/registUser`, {
      email: email,
      password: password,
      userName: userName
    });
    return response.data;
  }