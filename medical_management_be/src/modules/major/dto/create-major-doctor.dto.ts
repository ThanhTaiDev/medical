import { z } from 'zod';

export const createMajorDoctorSchema = z.object({
  code: z.string().min(1, { message: 'Mã chuyên khoa không được để trống' }),
  name: z.string().min(1, { message: 'Tên chuyên khoa không được để trống' }),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateMajorDoctorDto = z.infer<typeof createMajorDoctorSchema>;
