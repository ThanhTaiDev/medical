import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const majorDoctors = [
  { code: 'DINH_DUONG', name: 'Dinh dưỡng', nameEn: 'Nutrition', description: 'Chuyên khoa dinh dưỡng và chế độ ăn uống', sortOrder: 1 },
  { code: 'TAM_THAN', name: 'Tâm thần', nameEn: 'Psychiatry', description: 'Chuyên khoa tâm thần và sức khỏe tâm lý', sortOrder: 2 },
  { code: 'TIM_MACH', name: 'Tim mạch', nameEn: 'Cardiology', description: 'Chuyên khoa tim mạch và huyết áp', sortOrder: 3 },
  { code: 'NOI_TIET', name: 'Nội tiết', nameEn: 'Endocrinology', description: 'Chuyên khoa nội tiết và chuyển hóa', sortOrder: 4 },
  { code: 'NGOAI_KHOA', name: 'Ngoại khoa', nameEn: 'Surgery', description: 'Chuyên khoa ngoại khoa tổng quát', sortOrder: 5 },
  { code: 'PHU_SAN', name: 'Phụ sản', nameEn: 'Obstetrics & Gynecology', description: 'Chuyên khoa phụ sản và sản phụ khoa', sortOrder: 6 },
  { code: 'NHI_KHOA', name: 'Nhi khoa', nameEn: 'Pediatrics', description: 'Chuyên khoa nhi và trẻ em', sortOrder: 7 },
  { code: 'MAT', name: 'Mắt', nameEn: 'Ophthalmology', description: 'Chuyên khoa mắt và thị lực', sortOrder: 8 },
  { code: 'TAI_MUI_HONG', name: 'Tai mũi họng', nameEn: 'ENT', description: 'Chuyên khoa tai mũi họng', sortOrder: 9 },
  { code: 'DA_LIEU', name: 'Da liễu', nameEn: 'Dermatology', description: 'Chuyên khoa da liễu và thẩm mỹ', sortOrder: 10 },
  { code: 'XUONG_KHOP', name: 'Xương khớp', nameEn: 'Orthopedics', description: 'Chuyên khoa xương khớp và cột sống', sortOrder: 11 },
  { code: 'THAN_KINH', name: 'Thần kinh', nameEn: 'Neurology', description: 'Chuyên khoa thần kinh và não bộ', sortOrder: 12 },
  { code: 'UNG_BUOU', name: 'Ung bướu', nameEn: 'Oncology', description: 'Chuyên khoa ung bướu và ung thư', sortOrder: 13 },
  { code: 'HO_HAP', name: 'Hô hấp', nameEn: 'Pulmonology', description: 'Chuyên khoa hô hấp và phổi', sortOrder: 14 },
  { code: 'TIEU_HOA', name: 'Tiêu hóa', nameEn: 'Gastroenterology', description: 'Chuyên khoa tiêu hóa và gan mật', sortOrder: 15 },
  { code: 'THAN_TIET_NIEU', name: 'Thận tiết niệu', nameEn: 'Nephrology & Urology', description: 'Chuyên khoa thận và tiết niệu', sortOrder: 16 },
];

async function seedMajorDoctors() {
  console.log('🌱 Seeding Major Doctors...');

  for (const major of majorDoctors) {
    const existing = await prisma.majorDoctorTable.findFirst({
      where: { code: major.code }
    });

    if (!existing) {
      await prisma.majorDoctorTable.create({
        data: major
      });
      console.log(`✅ Created: ${major.name} (${major.code})`);
    } else {
      console.log(`⏭️  Skipped: ${major.name} (${major.code}) - already exists`);
    }
  }

  console.log('🎉 Major Doctors seeding completed!');
}

seedMajorDoctors()
  .catch((e) => {
    console.error('❌ Error seeding major doctors:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
