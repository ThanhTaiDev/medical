import { PrismaClient, UserRole, UserStatus, Gender, AdherenceStatus, AlertType, PrescriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = '123123';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const vnPrefixes = [
  '090','093','097','098','096',
  '091','094','088','086',
  '032','033','034','035','036','037','038','039',
  '070','079','077','076','078',
  '081','082','083','084','085'
];

const vnFirstNames = ['An','Anh','Bảo','Bình','Châu','Chi','Dương','Giang','Hà','Hải','Hằng','Hiếu','Hoa','Hoàng','Hùng','Hương','Khánh','Kiên','Lan','Linh','Long','Mai','Minh','My','Nam','Ngân','Ngọc','Nghĩa','Nhung','Phát','Phúc','Phương','Quân','Quang','Quỳnh','Sơn','Tâm','Tân','Thảo','Thành','Thắng','Thanh','Thảo','Thịnh','Thu','Thúy','Trang','Trinh','Trung','Tú','Tuấn','Tuyết','Vy','Yến'];
const vnLastNames = ['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Phan','Vũ','Võ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương','Lý'];
const vnMiddleNames = ['Văn','Hữu','Thị','Ngọc','Quốc','Gia','Minh','Anh','Hoàng','Thanh','Đức','Xuân','Thuỳ','Phương','Hải','Bảo','Tuấn','Thảo'];

function generateVietnamPhone(index: number): string {
  const prefix = vnPrefixes[index % vnPrefixes.length];
  const tailNum = (1000000 + (index % 9000000)).toString().padStart(7, '0');
  return `${prefix}${tailNum}`;
}

function generateVietnamName(seed: number): string {
  const last = vnLastNames[seed % vnLastNames.length];
  const middle = vnMiddleNames[seed % vnMiddleNames.length];
  const first = vnFirstNames[seed % vnFirstNames.length];
  return `${last} ${middle} ${first}`;
}

async function seedDevelopment() {
  console.log('🌱 Seeding development data (preserving existing data)...');

  // 1) Kiểm tra và tạo Major Doctors nếu chưa có
  const existingMajors = await prisma.majorDoctorTable.count();
  if (existingMajors === 0) {
    console.log('📋 Creating major doctors...');
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

    for (const major of majorDoctors) {
      await prisma.majorDoctorTable.create({ data: major });
      console.log(`✅ Created: ${major.name} (${major.code})`);
    }
  } else {
    console.log(`⏭️  Major doctors already exist (${existingMajors} records)`);
  }

  // 2) Kiểm tra và tạo Admin user nếu chưa có
  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.ADMIN }
  });

  if (!existingAdmin) {
    console.log('👤 Creating admin user...');
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await prisma.user.create({
      data: {
        phoneNumber: generateVietnamPhone(0),
        password: passwordHash,
        fullName: 'Quản trị Hệ thống',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE
      }
    });
    console.log('✅ Admin user created');
  } else {
    console.log('⏭️  Admin user already exists');
  }

  // 3) Kiểm tra và tạo một số bác sĩ mẫu nếu chưa có
  const existingDoctors = await prisma.user.count({
    where: { role: UserRole.DOCTOR }
  });

  if (existingDoctors === 0) {
    console.log('👨‍⚕️ Creating sample doctors...');
    const majorDoctors = await prisma.majorDoctorTable.findMany();
    
    for (let i = 1; i <= 5; i++) {
      const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      const majorDoctor = pickOne(majorDoctors);
      
      await prisma.user.create({
        data: {
          phoneNumber: generateVietnamPhone(i),
          password: passwordHash,
          fullName: `BS. ${generateVietnamName(i)}`,
          role: UserRole.DOCTOR,
          majorDoctorId: majorDoctor.id,
          status: UserStatus.ACTIVE
        }
      });
      console.log(`✅ Created doctor: BS. ${generateVietnamName(i)} (${majorDoctor.name})`);
    }
  } else {
    console.log(`⏭️  Doctors already exist (${existingDoctors} records)`);
  }

  // 4) Kiểm tra và tạo một số bệnh nhân mẫu nếu chưa có
  const existingPatients = await prisma.user.count({
    where: { role: UserRole.PATIENT }
  });

  if (existingPatients === 0) {
    console.log('👥 Creating sample patients...');
    const doctors = await prisma.user.findMany({
      where: { role: UserRole.DOCTOR },
      take: 3
    });
    
    for (let i = 1; i <= 10; i++) {
      const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      const assignedDoctor = pickOne(doctors);
      
      const patient = await prisma.user.create({
        data: {
          phoneNumber: generateVietnamPhone(1000 + i),
          password: passwordHash,
          fullName: generateVietnamName(2000 + i),
          role: UserRole.PATIENT,
          createdBy: assignedDoctor.id,
          status: UserStatus.ACTIVE
        }
      });

      // Tạo profile cho bệnh nhân
      await prisma.patientProfile.create({
        data: {
          userId: patient.id,
          gender: pickOne([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
          birthDate: new Date(1990, randomInt(0, 11), randomInt(1, 28)),
          address: `Số ${randomInt(1, 200)} Đường ABC, Q.${randomInt(1, 12)}, TP.HCM`
        }
      });

      // Tạo medical history cho bệnh nhân
      await prisma.patientMedicalHistory.create({
        data: {
          patientId: patient.id,
          conditions: pickOne([['Tăng huyết áp'], ['Đái tháo đường'], []]),
          allergies: pickOne([['Penicillin'], ['Hải sản'], []]),
          surgeries: pickOne([['Cắt ruột thừa'], []]),
          familyHistory: pickOne(['Không', 'Gia đình có tăng huyết áp', 'Gia đình có đái tháo đường']),
          lifestyle: pickOne(['Hút thuốc', 'Không hút thuốc', 'Uống rượu xã giao']),
          currentMedications: [],
          notes: pickOne(['', 'Cần theo dõi thêm', 'Ổn định'])
        }
      });

      console.log(`✅ Created patient: ${generateVietnamName(2000 + i)}`);
    }
  } else {
    console.log(`⏭️  Patients already exist (${existingPatients} records)`);
  }

  console.log('🎉 Development seeding completed!');
  console.log('📊 Summary:');
  console.log(`   - Major Doctors: ${await prisma.majorDoctorTable.count()}`);
  console.log(`   - Users: ${await prisma.user.count()}`);
  console.log(`   - Doctors: ${await prisma.user.count({ where: { role: UserRole.DOCTOR } })}`);
  console.log(`   - Patients: ${await prisma.user.count({ where: { role: UserRole.PATIENT } })}`);
  console.log(`   - Patient Profiles: ${await prisma.patientProfile.count()}`);
  console.log(`   - Medical Histories: ${await prisma.patientMedicalHistory.count()}`);
}

seedDevelopment()
  .catch((e) => {
    console.error('❌ Error seeding development data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
