require('dotenv').config({ path: '../../backend/.env' })
const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

// Import all models
const User         = require('../../backend/src/models/User.model')
const Patient      = require('../../backend/src/models/Patient.model')
const Doctor       = require('../../backend/src/models/Doctor.model')
const Appointment  = require('../../backend/src/models/Appointment.model')
const Prescription = require('../../backend/src/models/Prescription.model')
const Consultation = require('../../backend/src/models/Consultation.model')
const MedicalRecord= require('../../backend/src/models/MedicalRecord.model')
const Billing      = require('../../backend/src/models/Billing.model')
const Notification = require('../../backend/src/models/Notification.model')

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'medicore' })
  console.log('✅ Connected to MongoDB')

  // Clear all collections
  await Promise.all([
    User.deleteMany(), Patient.deleteMany(), Doctor.deleteMany(),
    Appointment.deleteMany(), Prescription.deleteMany(),
    Consultation.deleteMany(), MedicalRecord.deleteMany(),
    Billing.deleteMany(), Notification.deleteMany(),
  ])
  console.log('🗑  Cleared all collections')

  // ── Users ────────────────────────────────────────────────────
  const users = await User.create([
    { name:'Admin User',       email:'admin@medicore.health',   password:'Admin@1234',  role:'admin' },
    { name:'Dr. Mei Chen',     email:'mei.chen@medicore.health',password:'Doctor@1234', role:'doctor' },
    { name:'Dr. Raj Patel',    email:'raj.patel@medicore.health',password:'Doctor@1234',role:'doctor' },
    { name:'Dr. Sarah Williams',email:'sarah.w@medicore.health', password:'Doctor@1234',role:'doctor' },
    { name:'Dr. Marcus Rivera', email:'marcus.r@medicore.health',password:'Doctor@1234',role:'doctor' },
    { name:'Nurse Aisha',       email:'aisha@medicore.health',   password:'Nurse@1234', role:'nurse' },
    { name:'Receptionist Ram',  email:'ram@medicore.health',     password:'Recep@1234', role:'receptionist' },
  ])
  console.log(`👤 Created ${users.length} users`)

  // ── Doctors ───────────────────────────────────────────────────
  const [, drChenUser, drPatelUser, drWilliamsUser, drRiveraUser] = users

  const doctors = await Doctor.create([
    { user: drChenUser._id,     name:'Dr. Mei Chen',      specialization:'Cardiology',    qualification:['MBBS','MD Cardiology'], experience:12, consultationFee:150,
      avgRating:4.9, totalRatings:210,
      availability:[{day:'Mon',startTime:'09:00',endTime:'17:00'},{day:'Tue',startTime:'09:00',endTime:'17:00'},{day:'Wed',startTime:'09:00',endTime:'17:00'},{day:'Thu',startTime:'09:00',endTime:'17:00'},{day:'Fri',startTime:'09:00',endTime:'17:00'}] },
    { user: drPatelUser._id,    name:'Dr. Raj Patel',     specialization:'Endocrinology', qualification:['MBBS','DM Endocrinology'], experience:9, consultationFee:150,
      avgRating:4.8, totalRatings:183,
      availability:[{day:'Mon',startTime:'09:00',endTime:'17:00'},{day:'Tue',startTime:'09:00',endTime:'17:00'},{day:'Wed',startTime:'09:00',endTime:'17:00'},{day:'Thu',startTime:'09:00',endTime:'17:00'}] },
    { user: drWilliamsUser._id, name:'Dr. Sarah Williams',specialization:'Orthopedics',   qualification:['MBBS','MS Ortho'], experience:8, consultationFee:150,
      avgRating:4.7, totalRatings:154,
      availability:[{day:'Tue',startTime:'09:00',endTime:'17:00'},{day:'Wed',startTime:'09:00',endTime:'17:00'},{day:'Thu',startTime:'09:00',endTime:'17:00'},{day:'Fri',startTime:'09:00',endTime:'17:00'},{day:'Sat',startTime:'09:00',endTime:'13:00'}] },
    { user: drRiveraUser._id,   name:'Dr. Marcus Rivera', specialization:'Neurology',     qualification:['MBBS','DM Neurology'], experience:11, consultationFee:150,
      avgRating:4.9, totalRatings:196,
      availability:[{day:'Mon',startTime:'09:00',endTime:'17:00'},{day:'Tue',startTime:'09:00',endTime:'17:00'},{day:'Wed',startTime:'09:00',endTime:'17:00'},{day:'Thu',startTime:'09:00',endTime:'17:00'},{day:'Fri',startTime:'09:00',endTime:'17:00'}] },
  ])
  const [drChen, drPatel, drWilliams, drRivera] = doctors
  console.log(`🩺 Created ${doctors.length} doctors`)

  // ── Patients ──────────────────────────────────────────────────
  const patients = await Patient.create([
    { patientId:'P001', name:'Amara Osei',       dob: new Date('1992-03-14'), gender:'F', blood:'O+',  phone:'+91-9876543210', condition:'Hypertension',  status:'Active',   allergies:['Penicillin'],   chronicDiseases:['Hypertension'],      assignedDoctor: drChen._id,     history:'Diagnosed 2022. BP avg 145/90.' },
    { patientId:'P002', name:'Liam Torres',      dob: new Date('1965-07-22'), gender:'M', blood:'A-',  phone:'+91-9876543211', condition:'Diabetes T2',   status:'Critical', allergies:['Sulfa drugs'],  chronicDiseases:['Type 2 Diabetes','Dyslipidemia'], assignedDoctor: drPatel._id,    history:'T2DM since 2018. HbA1c 9.1%.' },
    { patientId:'P003', name:'Yuki Nakamura',    dob: new Date('1998-11-05'), gender:'F', blood:'B+',  phone:'+91-9876543212', condition:'Asthma',        status:'Stable',   allergies:['NSAIDs'],       chronicDiseases:['Asthma'],            assignedDoctor: drChen._id,     history:'Mild persistent asthma. FEV1 78%.' },
    { patientId:'P004', name:'Samuel Okafor',    dob: new Date('1981-04-17'), gender:'M', blood:'AB+', phone:'+91-9876543213', condition:'Arthritis',     status:'Active',   allergies:['None known'],   chronicDiseases:['Rheumatoid Arthritis'], assignedDoctor: drWilliams._id, history:'RF positive. Moderate disease activity.' },
    { patientId:'P005', name:'Fatima Al-Hassan', dob: new Date('1974-09-30'), gender:'F', blood:'O-',  phone:'+91-9876543214', condition:'Cardiac',       status:'Critical', allergies:['Aspirin'],      chronicDiseases:['Unstable Angina','Hypertension'], assignedDoctor: drPatel._id,    history:'Unstable angina. ST changes on ECG.' },
  ])
  console.log(`👥 Created ${patients.length} patients`)

  const [p1, p2, p3, p4, p5] = patients

  // ── Appointments ──────────────────────────────────────────────
  const today = new Date('2026-03-05')
  await Appointment.create([
    { patient:p1._id, doctor:drChen._id,     date:today, time:'09:00', type:'Follow-up',  room:'3A',  status:'Confirmed',    bookedBy:users[0]._id },
    { patient:p2._id, doctor:drPatel._id,    date:today, time:'09:45', type:'Urgent',     room:'2B',  status:'In Progress',  bookedBy:users[0]._id },
    { patient:p3._id, doctor:drChen._id,     date:today, time:'10:30', type:'Routine',    room:'3A',  status:'Waiting',      bookedBy:users[6]._id },
    { patient:p5._id, doctor:drPatel._id,    date:today, time:'13:00', type:'Urgent',     room:'ICU', status:'Confirmed',    bookedBy:users[0]._id },
    { patient:p4._id, doctor:drWilliams._id, date:new Date('2026-03-06'), time:'14:30', type:'Follow-up', room:'1C', status:'Confirmed', bookedBy:users[6]._id },
    { patient:p1._id, doctor:drRivera._id,   date:new Date('2026-03-07'), time:'10:00', type:'Routine',   room:'4D', status:'Scheduled', bookedBy:users[6]._id },
  ])
  console.log('📅 Created appointments')

  // ── Prescriptions ─────────────────────────────────────────────
  await Prescription.create([
    { rxId:'RX001', patient:p1._id, doctor:drChen._id,  diagnosis:'Hypertension Stage 1', status:'Active',
      medicines:[{name:'Amlodipine',dose:'5mg',frequency:'Once daily',duration:'30 days',notes:'Take with food'},{name:'Lisinopril',dose:'10mg',frequency:'Once daily',duration:'30 days',notes:'Monitor BP'}],
      notes:'Lifestyle changes recommended. Low-sodium diet.' },
    { rxId:'RX002', patient:p2._id, doctor:drPatel._id, diagnosis:'Type 2 Diabetes', status:'Active',
      medicines:[{name:'Metformin',dose:'500mg',frequency:'Twice daily',duration:'90 days',notes:'With meals'},{name:'Glipizide',dose:'5mg',frequency:'Once daily',duration:'90 days',notes:'Before breakfast'},{name:'Atorvastatin',dose:'20mg',frequency:'Once nightly',duration:'90 days'}],
      notes:'HbA1c target <7%. Monthly glucose monitoring.' },
    { rxId:'RX003', patient:p3._id, doctor:drChen._id,  diagnosis:'Acute Asthma Exacerbation', status:'Completed',
      medicines:[{name:'Salbutamol',dose:'100mcg',frequency:'As needed',duration:'14 days',notes:'2 puffs'},{name:'Fluticasone',dose:'250mcg',frequency:'Twice daily',duration:'14 days',notes:'Preventer'}],
      notes:'Follow up in 2 weeks.' },
  ])
  console.log('💊 Created prescriptions')

  // ── Consultations ─────────────────────────────────────────────
  await Consultation.create([
    { consultId:'C001', patient:p1._id, doctor:drChen._id,  date:new Date('2026-03-04'),
      vitals:{bp:'148/94',hr:82,temp:36.8,spo2:98},
      symptoms:'Persistent headache, dizziness, elevated BP readings at home',
      diagnosis:'Hypertension Stage 1 — poorly controlled',
      notes:'Patient reports stress at work. Sleep 5h/night.',
      plan:'Increase Amlodipine to 10mg. Recheck BP in 2 weeks.' },
    { consultId:'C002', patient:p2._id, doctor:drPatel._id, date:new Date('2026-03-03'),
      vitals:{bp:'132/82',hr:78,temp:37.1,spo2:97},
      symptoms:'Polyuria, polydipsia, fatigue, blurred vision',
      diagnosis:'Type 2 Diabetes — suboptimal glycaemic control',
      notes:'Non-compliant with diet. Skipping evening Metformin.',
      plan:'Add Glipizide. Dietitian referral. Monthly HbA1c.' },
  ])
  console.log('📋 Created consultations')

  // ── Billings ──────────────────────────────────────────────────
  await Billing.create([
    { patient:p2._id, doctor:drPatel._id,
      services:[{name:'Consultation',code:'99213',quantity:1,unitPrice:150,amount:150},{name:'Blood Glucose',code:'82947',quantity:1,unitPrice:85,amount:85},{name:'HbA1c',code:'83036',quantity:1,unitPrice:220,amount:220}],
      status:'Unpaid', createdBy:users[6]._id },
    { patient:p1._id, doctor:drChen._id,
      services:[{name:'Consultation',code:'99213',quantity:1,unitPrice:150,amount:150},{name:'ECG',code:'93000',quantity:1,unitPrice:120,amount:120},{name:'Amlodipine 30-day',code:'DRUG001',quantity:1,unitPrice:45,amount:45}],
      status:'Paid', payments:[{amount:315,method:'Card',reference:'TXN-20260304-001'}], createdBy:users[6]._id },
    { patient:p5._id, doctor:drPatel._id,
      services:[{name:'Emergency Consult',code:'99285',quantity:1,unitPrice:300,amount:300},{name:'Cardiac Monitoring',code:'93041',quantity:1,unitPrice:450,amount:450},{name:'Lab Panel',code:'80053',quantity:1,unitPrice:180,amount:180}],
      status:'Partial', payments:[{amount:500,method:'Cash',reference:'CASH-001'}], createdBy:users[0]._id },
  ])
  console.log('🧾 Created billing records')

  // ── Notifications ─────────────────────────────────────────────
  const admin = users[0]
  await Notification.create([
    { recipient:admin._id, type:'info',     title:'Lab Results Ready',    message:'CBC panel results available for Liam Torres (P002)',      relatedPatient:p2._id },
    { recipient:admin._id, type:'critical', title:'Vitals Alert',         message:'Fatima Al-Hassan vitals drop detected — immediate review', relatedPatient:p5._id },
    { recipient:admin._id, type:'success',  title:'Prescription Approved',message:'Prescription RX001 approved for Amara Osei',               relatedPatient:p1._id },
    { recipient:admin._id, type:'info',     title:'Slot Available',       message:'Dr. Chen appointment slot freed at 15:00',                 relatedDoctor:drChen._id },
  ])
  console.log('🔔 Created notifications')

  console.log('\n🎉 Seed complete!')
  console.log('─────────────────────────────────────')
  console.log('Login credentials:')
  console.log('  Admin:        admin@medicore.health / Admin@1234')
  console.log('  Doctor:       mei.chen@medicore.health / Doctor@1234')
  console.log('  Nurse:        aisha@medicore.health / Nurse@1234')
  console.log('  Receptionist: ram@medicore.health / Recep@1234')
  console.log('─────────────────────────────────────')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
