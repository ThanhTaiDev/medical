import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SignInData } from "../api/auth/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth/auth.api";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SignInData>({
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      // If already logged in, route by role
      const rolesRaw = localStorage.getItem("roles");
      let target = "/dashboard";
      try {
        const role = rolesRaw ? (JSON.parse(rolesRaw) as string[])[0] : null;
        if (role === "DOCTOR") target = "/dashboard/doctor-patients";
        else if (role === "PATIENT") target = "/dashboard/patients";
      } catch {}
      navigate(target);
    }
  }, [navigate]);

  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      phoneNumber?: string;
      password?: string;
    } = {};

    const phoneRegex = /^0\d{9}$/;
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Vui lòng sửa các lỗi trong biểu mẫu", {
        duration: 4000,
        position: "top-center",
        style: { background: "#EF4444", color: "#fff" },
      });
      return;
    }

    try {
      const res = await authApi.signIn(formData);
      // Persist tokens
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("roles", JSON.stringify([res.user.role]));

      // Dispatch custom event to notify other components about auth change
      window.dispatchEvent(new Event("authChange"));

      // Refresh current user cache
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // Navigate based on role
      const role = res.user.role;
      const target = role === "DOCTOR" ? "/dashboard/doctor-patients" : role === "PATIENT" ? "/dashboard/patients" : "/dashboard";

      toast.success("Đăng nhập thành công! Đang chuyển hướng...", {
        duration: 800,
        position: "top-center",
        style: { background: "#10B981", color: "#fff" },
      });

      setTimeout(() => navigate(target), 600);
    } catch (error: unknown) {
      const message = (error as any)?.response?.data?.message || "Đăng nhập thất bại";
      toast.error(message, {
        duration: 2500,
        position: "top-center",
        style: { background: "#EF4444", color: "#fff" },
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Filter phone number input to only allow digits
    let filteredValue = value;
    if (name === "phoneNumber") {
      filteredValue = value.replace(/[^0-9]/g, "");
    }
    
    setFormData((prev) => ({ ...prev, [name]: filteredValue }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md animate-fade-in">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center relative">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-float"></div>
          <div
            className="absolute -bottom-5 -right-5 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>

          <h2 className="text-2xl font-bold text-white relative z-10">
            Chào Mừng Trở Lại
          </h2>
          <p className="text-blue-100 mt-1 relative z-10">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>

        <div className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="input-field bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300">
              <label
                htmlFor="phoneNumber"
                className="block text-xs text-gray-500 px-4 pt-3"
              >
                Số Điện Thoại
              </label>
              <div className="flex items-center px-4 pb-2">
                <i className="fas fa-phone text-gray-400 mr-2"></i>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none bg-transparent focus:outline-none focus:ring-0 ${errors.phoneNumber ? "border-red-500" : ""
                    }`}
                  placeholder="0xxxxxxxxx"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs px-4 pb-2">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="input-field bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300">
              <label
                htmlFor="password"
                className="block text-xs text-gray-500 px-4 pt-3"
              >
                Mật Khẩu
              </label>
              <div className="flex items-center px-4 pb-2">
                <i className="fas fa-lock text-gray-400 mr-2"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none bg-transparent focus:outline-none focus:ring-0 ${errors.password ? "border-red-500" : ""
                    }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-500"
                >
                  <i className="fas fa-eye-slash"></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs px-4 pb-2">
                  {errors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-md"
            >
              Đăng Nhập
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
