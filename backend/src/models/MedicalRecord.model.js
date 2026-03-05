const mongoose = require('mongoose')

const MedicalRecordSchema = new mongoose.Schema({
  recordId: {
    type: String, unique: true,
    default: () => 'R' + Date.now().toString().slice(-6),
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:  { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },

  type: {
    type: String,
    enum: ['Lab Report','ECG','X-Ray','MRI','CT Scan','Spirometry','Ultrasound','Biopsy','Other'],
    required: true,
  },
  tag: {
    type: String,
    enum: ['Lab', 'Imaging', 'Cardio', 'Pulm', 'Other'],
    default: 'Other',
  },
  name:        { type: String, required: true },
  description: { type: String },

  // Cloudinary / S3
  fileUrl:      { type: String, required: true },
  filePublicId: { type: String },   // Cloudinary public_id for deletion
  mimeType:     { type: String },
  sizeBytes:    { type: Number },

  // AI summary
  aiSummary:     { type: String },
  aiGeneratedAt: { type: Date },

  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })

MedicalRecordSchema.index({ patient: 1, type: 1 })
MedicalRecordSchema.index({ patient: 1, tag: 1 })

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema)
