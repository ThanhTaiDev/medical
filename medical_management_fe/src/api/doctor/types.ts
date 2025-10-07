export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT";

export type MajorDoctor = 
  | "DINH_DUONG" 
  | "TAM_THAN" 
  | "TIM_MACH" 
  | "NOI_TIET" 
  | "NGOAI_KHOA" 
  | "PHU_SAN" 
  | "NHI_KHOA" 
  | "MAT" 
  | "TAI_MUI_HONG" 
  | "DA_LIEU" 
  | "XUONG_KHOP" 
  | "THAN_KINH" 
  | "UNG_BUOU" 
  | "HO_HAP" 
  | "TIEU_HOA" 
  | "THAN_TIET_NIEU";

// Utility function to get Vietnamese name for specialty
export const getMajorDoctorName = (major: MajorDoctor): string => {
  const majorNames: Record<MajorDoctor, string> = {
    "DINH_DUONG": "Dinh dưỡng",
    "TAM_THAN": "Tâm thần", 
    "TIM_MACH": "Tim mạch",
    "NOI_TIET": "Nội tiết",
    "NGOAI_KHOA": "Ngoại khoa",
    "PHU_SAN": "Phụ sản",
    "NHI_KHOA": "Nhi khoa",
    "MAT": "Mắt",
    "TAI_MUI_HONG": "Tai mũi họng",
    "DA_LIEU": "Da liễu",
    "XUONG_KHOP": "Xương khớp",
    "THAN_KINH": "Thần kinh",
    "UNG_BUOU": "Ung bướu",
    "HO_HAP": "Hô hấp",
    "TIEU_HOA": "Tiêu hóa",
    "THAN_TIET_NIEU": "Thận tiết niệu"
  };
  return majorNames[major] || major;
};

export interface MajorDoctorTable {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  majorDoctor?: MajorDoctorTable; // Changed to object with relation
}

// Alias for doctor user type
export type DoctorUser = User;

export interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
  phoneNumber: string;
  email: string;
  avatar?: string;
}

export interface DoctorSchedule {
  id: string;
  userId: string;
  status: "FREE" | "BOOKED";
  startDate: string;
  endDate: string;
  user: User;
}

export interface CreateScheduleData {
  userId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateScheduleData {
  userId: string;
  startDate: string;
  endDate: string;
}

export interface DoctorSchedulesResponse {
  data: DoctorSchedule[];
  statusCode: number;
}

export interface SingleDoctorScheduleResponse {
  data: DoctorSchedule;
  statusCode: number;
}

export interface DoctorWithSchedule extends Doctor {
  schedules: DoctorSchedule[];
}

export interface AvailableDoctorsResponse {
  data: DoctorWithSchedule[];
  total: number;
}

export interface DoctorListResponse {
  data: User[];
  total?: number;
  statusCode: number;
}

export interface CreateDoctorData {
  phoneNumber: string;
  fullName: string;
  majorDoctor: string; // ID of MajorDoctorTable
  password: string;
}

export interface UpdateDoctorData {
  fullName?: string;
  phoneNumber?: string;
  majorDoctor?: string; // ID of MajorDoctorTable
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}
