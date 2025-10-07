import { axiosInstance } from '../axios';

export interface MajorDoctor {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
}

export interface MajorDoctorResponse {
  data: MajorDoctor[];
}

export const majorApi = {
  // Lấy danh sách chuyên khoa đang hoạt động (cho dropdown)
  getActiveMajors: async (): Promise<MajorDoctorResponse> => {
    const response = await axiosInstance.get('/major-doctors/active');
    return response.data;
  },

  // Lấy danh sách chuyên khoa với phân trang và tìm kiếm
  getMajors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await axiosInstance.get('/major-doctors', { params });
    return response.data;
  },

  // Lấy chi tiết một chuyên khoa
  getMajorById: async (id: string) => {
    const response = await axiosInstance.get(`/major-doctors/${id}`);
    return response.data;
  },

  // Tạo mới chuyên khoa (ADMIN only)
  createMajor: async (data: {
    code: string;
    name: string;
    nameEn?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) => {
    const response = await axiosInstance.post('/major-doctors', data);
    return response.data;
  },

  // Cập nhật chuyên khoa (ADMIN only)
  updateMajor: async (id: string, data: {
    code?: string;
    name?: string;
    nameEn?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) => {
    const response = await axiosInstance.patch(`/major-doctors/${id}`, data);
    return response.data;
  },

  // Cập nhật trạng thái chuyên khoa (ADMIN only)
  updateMajorStatus: async (id: string, isActive: boolean) => {
    const response = await axiosInstance.patch(`/major-doctors/${id}/status`, { isActive });
    return response.data;
  },

  // Xóa chuyên khoa (ADMIN only)
  deleteMajor: async (id: string) => {
    const response = await axiosInstance.delete(`/major-doctors/${id}`);
    return response.data;
  },
};
