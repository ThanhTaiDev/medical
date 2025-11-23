import { PrismaClient, UserRole, UserStatus, Gender, MajorDoctor, PrescriptionStatus, AdherenceStatus, AlertType } from '@prisma/client';
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

async function upsertUser(params: {
  phoneNumber: string;
  password?: string;
  fullName: string;
  role: UserRole;
  status?: UserStatus;
  majorDoctorId?: string;
  createdBy?: string;
}) {
  const passwordHash = await bcrypt.hash(params.password ?? DEFAULT_PASSWORD, 10);
  return prisma.user.upsert({
    where: { phoneNumber: params.phoneNumber },
    update: {},
    create: {
      phoneNumber: params.phoneNumber,
      password: passwordHash,
      fullName: params.fullName,
      role: params.role,
      status: params.status ?? UserStatus.ACTIVE,
      majorDoctorId: params.majorDoctorId,
      createdBy: params.createdBy
    }
  });
}

async function createMajorDoctors() {
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

  const created = [] as Array<{ id: string; code: string }>;
  for (const major of majorDoctors) {
    const existed = await prisma.majorDoctorTable.findFirst({ where: { code: major.code } });
    const majorDoctor = existed ?? (await prisma.majorDoctorTable.create({ data: major }));
    created.push({ id: majorDoctor.id, code: majorDoctor.code });
  }
  return created;
}

async function createMedications() {
  const meds = [
    { name: 'Paracetamol', strength: '500mg', form: 'tablet', unit: 'mg', description: 'Giảm đau hạ sốt', isActive: true },
    { name: 'Amoxicillin', strength: '500mg', form: 'capsule', unit: 'mg', description: 'Kháng sinh', isActive: true },
    { name: 'Metformin', strength: '500mg', form: 'tablet', unit: 'mg', description: 'Đái tháo đường', isActive: true },
    { name: 'Atorvastatin', strength: '20mg', form: 'tablet', unit: 'mg', description: 'Giảm mỡ máu', isActive: true },
    { name: 'Omeprazole', strength: '20mg', form: 'capsule', unit: 'mg', description: 'Trào ngược dạ dày', isActive: true },
    { name: 'Ibuprofen', strength: '400mg', form: 'tablet', unit: 'mg', description: 'Kháng viêm giảm đau', isActive: true },
    { name: 'Amlodipine', strength: '5mg', form: 'tablet', unit: 'mg', description: 'Huyết áp', isActive: true },
    { name: 'Losartan', strength: '50mg', form: 'tablet', unit: 'mg', description: 'Huyết áp', isActive: true },
    { name: 'Levothyroxine', strength: '50mcg', form: 'tablet', unit: 'mcg', description: 'Tuyến giáp', isActive: true },
    { name: 'Salbutamol', strength: '100mcg', form: 'inhaler', unit: 'mcg', description: 'Hen suyễn', isActive: true },
    { name: 'Azithromycin', strength: '500mg', form: 'tablet', unit: 'mg', description: 'Kháng sinh', isActive: true },
    { name: 'Vitamin D3', strength: '1000IU', form: 'tablet', unit: 'IU', description: 'Vitamin D', isActive: true },
    { name: 'Clopidogrel', strength: '75mg', form: 'tablet', unit: 'mg', description: 'Kháng kết tập tiểu cầu', isActive: true },
    { name: 'Aspirin', strength: '81mg', form: 'tablet', unit: 'mg', description: 'Chống đông liều thấp', isActive: true },
    { name: 'Gliclazide', strength: '30mg', form: 'tablet', unit: 'mg', description: 'Đái tháo đường', isActive: true },
    { name: 'Insulin Glargine', strength: '100IU/ml', form: 'pen', unit: 'IU/ml', description: 'Insulin nền', isActive: true },
    { name: 'Simvastatin', strength: '20mg', form: 'tablet', unit: 'mg', description: 'Statin', isActive: true },
    { name: 'Ranitidine', strength: '150mg', form: 'tablet', unit: 'mg', description: 'Dạ dày', isActive: true },
    { name: 'Ciprofloxacin', strength: '500mg', form: 'tablet', unit: 'mg', description: 'Kháng sinh quinolone', isActive: true },
    { name: 'Prednisone', strength: '5mg', form: 'tablet', unit: 'mg', description: 'Corticoid', isActive: true }
  ];

  const created = [] as Array<{ id: string; name: string }>;
  for (const m of meds) {
    const existed = await prisma.medication.findFirst({ where: { name: m.name } });
    const med = existed ?? (await prisma.medication.create({ data: m }));
    created.push({ id: med.id, name: med.name });
  }
  return created;
}

async function createPatientDetails(patientId: string) {
  await prisma.patientProfile.upsert({
    where: { userId: patientId },
    update: {},
    create: {
      userId: patientId,
      gender: pickOne([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
      birthDate: new Date(1990, randomInt(0, 11), randomInt(1, 28)),
      address: `Số ${randomInt(1, 200)} Đường ABC, Q.${randomInt(1, 12)}, TP.HCM`
    }
  });

  await prisma.patientMedicalHistory.upsert({
    where: { patientId },
    update: {},
    create: {
      patientId,
      conditions: pickOne([['Tăng huyết áp'], ['Đái tháo đường'], []]),
      allergies: pickOne([['Penicillin'], ['Hải sản'], []]),
      surgeries: pickOne([['Cắt ruột thừa'], []]),
      familyHistory: pickOne(['Không', 'Gia đình có tăng huyết áp', 'Gia đình có đái tháo đường']),
      lifestyle: pickOne(['Hút thuốc', 'Không hút thuốc', 'Uống rượu xã giao']),
      currentMedications: [],
      notes: pickOne(['', 'Cần theo dõi thêm', 'Ổn định'])
    }
  });
}

async function cleanupAll() {
  // Order matters due to FKs
  await prisma.adherenceLog.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.prescriptionItem.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.patientMedicalHistory.deleteMany({});
  await prisma.patientProfile.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.majorDoctorTable.deleteMany({});
}

async function seed() {
  console.log('Seeding database...');

  // Kiểm tra xem có nên seed hay không
  // Nếu có dữ liệu rồi và không có flag FORCE_SEED, thì skip
  const forceSeed = process.env.FORCE_SEED === 'true';
  const existingUsers = await prisma.user.count();
  
  if (existingUsers > 0 && !forceSeed) {
    console.log('Database already has data. Skipping seed.');
    console.log('To force seed (will delete all data), set FORCE_SEED=true');
    return;
  }

  if (forceSeed) {
    console.log('FORCE_SEED=true detected. Cleaning up existing data...');
    await cleanupAll();
  } else {
    await cleanupAll();
  }

  // 1) Major Doctors
  const majorDoctors = await createMajorDoctors();

  // 2) Users
  await upsertUser({
    phoneNumber: generateVietnamPhone(0),
    fullName: 'Quản trị Hệ thống',
    role: UserRole.ADMIN
  });

  const doctors: Array<{ id: string; fullName: string }> = [];
  for (let i = 1; i <= 10; i++) {
    const d = await upsertUser({
      phoneNumber: generateVietnamPhone(i),
      fullName: `BS. ${generateVietnamName(i)}`,
      role: UserRole.DOCTOR,
      majorDoctorId: majorDoctors[i % majorDoctors.length].id
    });
    doctors.push({ id: d.id, fullName: d.fullName });
  }

  const patients: Array<{ id: string; fullName: string }> = [];
  for (let i = 1; i <= 20; i++) {
    // Gán bệnh nhân cho bác sĩ ngẫu nhiên
    const assignedDoctor = pickOne(doctors);
    const p = await upsertUser({
      phoneNumber: generateVietnamPhone(1000 + i),
      fullName: generateVietnamName(2000 + i),
      role: UserRole.PATIENT,
      createdBy: assignedDoctor.id
    });
    patients.push({ id: p.id, fullName: p.fullName });
    await createPatientDetails(p.id);
  }

  // 3) Medications
  const medications = await createMedications();

  // 4) Create Prescriptions with Items
  console.log('Creating prescriptions...');
  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i];
    const assignedDoctor = doctors[i % doctors.length];
    
    // Tạo 1-2 prescriptions cho mỗi bệnh nhân
    const numPrescriptions = randomInt(1, 2);
    
    for (let p = 0; p < numPrescriptions; p++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - randomInt(0, 30)); // Trong 30 ngày qua
      const durationDays = randomInt(7, 30);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationDays);
      
      const prescription = await prisma.prescription.create({
        data: {
          patientId: patient.id,
          doctorId: assignedDoctor.id,
          status: randomInt(0, 10) > 2 ? PrescriptionStatus.ACTIVE : PrescriptionStatus.COMPLETED,
          startDate,
          endDate: randomInt(0, 10) > 7 ? endDate : null,
          notes: pickOne(['', 'Theo dõi thường xuyên', 'Uống sau ăn', 'Uống trước ăn']),
          items: {
            create: Array.from({ length: randomInt(1, 3) }, () => {
              const med = pickOne(medications);
              const timesOfDay = pickOne([
                ['08:00'],
                ['08:00', '20:00'],
                ['08:00', '14:00', '20:00'],
                ['07:00', '19:00']
              ]);
              
              return {
                medicationId: med.id,
                dosage: pickOne(['1 viên', '2 viên', '1/2 viên', '1 viên/lần']),
                frequencyPerDay: timesOfDay.length,
                timesOfDay,
                durationDays,
                route: pickOne(['Uống', 'Tiêm', 'Bôi', null]),
                instructions: pickOne(['Uống sau ăn', 'Uống trước ăn', 'Uống với nhiều nước', null])
              };
            })
          }
        },
        include: {
          items: true
        }
      });

      // Tạo một số adherence logs cho prescription items
      for (const item of prescription.items || []) {
        const numLogs = randomInt(5, 20);
        const logs = [];
        
        for (let logIdx = 0; logIdx < numLogs; logIdx++) {
          const takenAt = new Date(startDate);
          takenAt.setDate(takenAt.getDate() + logIdx);
          takenAt.setHours(randomInt(7, 21), randomInt(0, 59), 0, 0);
          
          if (takenAt <= new Date()) {
            logs.push({
              prescriptionId: prescription.id,
              prescriptionItemId: item.id,
              patientId: patient.id,
              takenAt,
              status: pickOne([AdherenceStatus.TAKEN, AdherenceStatus.TAKEN, AdherenceStatus.TAKEN, AdherenceStatus.MISSED]),
              amount: item.dosage,
              notes: randomInt(0, 10) > 8 ? pickOne(['Đã uống', 'Quên uống', null]) : null
            });
          }
        }
        
        if (logs.length > 0) {
          await prisma.adherenceLog.createMany({
            data: logs
          });
        }
      }

      // Tạo một số alerts
      if (randomInt(0, 10) > 6) {
        await prisma.alert.create({
          data: {
            prescriptionId: prescription.id,
            patientId: patient.id,
            doctorId: assignedDoctor.id,
            type: pickOne([AlertType.MISSED_DOSE, AlertType.LOW_ADHERENCE]),
            message: pickOne([
              'Bệnh nhân quên uống thuốc 2 lần liên tiếp',
              'Tỷ lệ tuân thủ thấp hơn 80%',
              'Cần theo dõi thêm'
            ]),
            resolved: randomInt(0, 10) > 7
          }
        });
      }
    }
  }

  console.log('Seeding done.');
}

seed()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
