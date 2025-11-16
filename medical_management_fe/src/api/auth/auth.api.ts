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
    // TODO: REMOVE THIS - TEMPORARY BYPASS FOR TESTING
    // Mock admin user if no token exists
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        data: {
          id: "mock-admin-id",
          phoneNumber: "0901000000",
          fullName: "Quản trị Hệ thống",
          role: "ADMIN",
          status: "ACTIVE"
        },
        statusCode: 200
      } as UserResponse;
    }
    
    const res = await axiosInstance.get("/auth/me");
    const raw = res.data?.data ?? res.data;
    // Normalize role field: backend may return `roles`
    const normalized = raw && typeof raw === "object"
      ? { ...raw, role: raw.role ?? raw.roles }
      : raw;
    return {
      data: normalized,
      statusCode: res.data?.statusCode ?? 200
    } as UserResponse;
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
