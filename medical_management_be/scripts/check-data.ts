import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 Checking database data...\n');

  try {
    // Kiểm tra MajorDoctorTable
    const majorDoctors = await prisma.majorDoctorTable.count();
    console.log(`🏥 Major Doctors: ${majorDoctors}`);

    // Kiểm tra Users
    const totalUsers = await prisma.user.count();
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
    const doctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    const patients = await prisma.user.count({ where: { role: 'PATIENT' } });
    
    console.log(`👥 Users: ${totalUsers}`);
    console.log(`   - Admins: ${admins}`);
    console.log(`   - Doctors: ${doctors}`);
    console.log(`   - Patients: ${patients}`);

    // Kiểm tra Patient Profiles
    const patientProfiles = await prisma.patientProfile.count();
    console.log(`📋 Patient Profiles: ${patientProfiles}`);

    // Kiểm tra Medical Histories
    const medicalHistories = await prisma.patientMedicalHistory.count();
    console.log(`🏥 Medical Histories: ${medicalHistories}`);

    // Kiểm tra Medications
    const medications = await prisma.medication.count();
    console.log(`💊 Medications: ${medications}`);

    // Kiểm tra Prescriptions
    const prescriptions = await prisma.prescription.count();
    console.log(`📝 Prescriptions: ${prescriptions}`);

    // Kiểm tra Prescription Items
    const prescriptionItems = await prisma.prescriptionItem.count();
    console.log(`📋 Prescription Items: ${prescriptionItems}`);

    // Kiểm tra Adherence Logs
    const adherenceLogs = await prisma.adherenceLog.count();
    console.log(`📊 Adherence Logs: ${adherenceLogs}`);

    // Kiểm tra Alerts
    const alerts = await prisma.alert.count();
    console.log(`🚨 Alerts: ${alerts}`);

    // Kiểm tra một số bác sĩ có chuyên khoa
    const doctorsWithMajor = await prisma.user.findMany({
      where: { 
        role: 'DOCTOR',
        majorDoctorId: { not: null }
      },
      include: {
        majorDoctor: true
      },
      take: 5
    });

    console.log('\n👨‍⚕️ Sample Doctors with Specialties:');
    doctorsWithMajor.forEach(doctor => {
      console.log(`   - ${doctor.fullName}: ${doctor.majorDoctor?.name || 'No specialty'}`);
    });

    // Kiểm tra một số bệnh nhân
    const samplePatients = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      include: {
        profile: true,
        medicalHistory: true
      },
      take: 3
    });

    console.log('\n👥 Sample Patients:');
    samplePatients.forEach(patient => {
      console.log(`   - ${patient.fullName}: ${patient.profile?.gender || 'No gender'}, ${patient.medicalHistory?.conditions?.length || 0} conditions`);
    });

    console.log('\n✅ Data check completed successfully!');

  } catch (error) {
    console.error('❌ Error checking data:', error);
  }
}

checkData()
  .finally(async () => {
    await prisma.$disconnect();
  });
