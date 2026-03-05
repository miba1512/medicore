const mongoose = require('mongoose')

const VitalSchema = new mongoose.Schema({
  bp:    String,
  hr:    Number,
  temp:  Number,
  spo2:  Number,
  weight:Number,
  height:Number,
  recordedAt: { type: Date, default: Date.now },
}, { _id: false })

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String, unique: true,
    default: () => 'P' + Math.floor(Math.random() * 90000 + 10000),
  },
  name:    { type: String, required: true, trim: true, index: true },
  dob:     { type: Date,   required: true },
  gender:  { type: String, enum: ['M', 'F', 'Other'], required: true },
  blood:   { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
  phone:   { type: String },
  email:   { type: String },
  address: {
    street: String, city: String, state: String, zip: String,
  },

  // Medical info
  condition:       { type: String },
  allergies:       [{ type: String }],
  chronicDiseases: [{ type: String }],
  currentMeds:     [{ type: String }],
  history:         { type: String },

  // Relations
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },

  // Status
  status: {
    type: String,
    enum: ['Active', 'Stable', 'Critical', 'Discharged', 'Inactive'],
    default: 'Active',
  },

  // Latest vitals snapshot
  latestVitals: VitalSchema,

  // Emergency contact
  emergencyContact: {
    name: String, relation: String, phone: String,
  },

  // Insurance
  insurance: {
    provider: String, policyNumber: String, groupNumber: String,
  },

}, { timestamps: true })

// Full-text search index
PatientSchema.index({ name: 'text', condition: 'text', patientId: 'text' })

// Virtual: age
PatientSchema.virtual('age').get(function () {
  const today = new Date()
  const birth = new Date(this.dob)
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() ||
     (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
  return age
})

PatientSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Patient', PatientSchema)
