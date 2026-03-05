const mongoose = require('mongoose')

const MedicineSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  dose:     { type: String, required: true },
  frequency:{ type: String, required: true },
  duration: { type: String, required: true },
  notes:    { type: String },
  isFavourite: { type: Boolean, default: false },
}, { _id: false })

const PrescriptionSchema = new mongoose.Schema({
  rxId: {
    type: String, unique: true,
    default: () => 'RX' + Date.now().toString().slice(-6),
  },
  patient:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:       { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },

  diagnosis: { type: String, required: true },
  medicines: { type: [MedicineSchema], validate: v => v.length > 0 },
  notes:     { type: String },

  status: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled'],
    default: 'Active',
  },

  // PDF storage
  pdfUrl: { type: String },

  // AI summary
  aiSummary:     { type: String },
  aiGeneratedAt: { type: Date },

}, { timestamps: true })

PrescriptionSchema.index({ patient: 1, status: 1 })
PrescriptionSchema.index({ doctor: 1, createdAt: -1 })

module.exports = mongoose.model('Prescription', PrescriptionSchema)
