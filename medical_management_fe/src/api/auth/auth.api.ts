// Mocked auth API for FE-only flow
import { axiosInstance } from "../axios";
import { AuthResponse, SignInData, SignUpData, UserResponse } from "./types";

export const authApi = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const res = await axiosInstance.post("/auth/register", data);
    // Backend wraps response: { statusCode, message?, data }
    const payload = res.data?.data ?? res.data;
    return payload as AuthResponse;
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const res = await axiosInstance.post("/auth/login", data);
    const payload = res.data?.data ?? res.data;
    return payload as AuthResponse;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const res = await axiosInstance.get("/auth/me");
    // /auth/me returns user directly or wrapped
    if (res.data?.data) {
      return { data: res.data.data, statusCode: res.data.statusCode ?? 200 } as UserResponse;
    }
    return { data: res.data, statusCode: 200 } as UserResponse;
  },

  logout(): void {
    try {
      axiosInstance.post("/auth/logout").catch(() => {});
    } catch {
      // ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roles");
  }
};
