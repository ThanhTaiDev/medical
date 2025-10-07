import { z } from 'zod';
import { createMajorDoctorSchema } from './create-major-doctor.dto';

export const updateMajorDoctorSchema = createMajorDoctorSchema.partial();

export type UpdateMajorDoctorDto = z.infer<typeof updateMajorDoctorSchema>;
