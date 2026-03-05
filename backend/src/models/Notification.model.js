const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['critical','info','success','warning'],
    default: 'info',
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  link:    { type: String },             // e.g. "/patients/P001"
  read:    { type: Boolean, default: false },
  dismissed:{ type: Boolean, default: false },

  // Optional refs
  relatedPatient:{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  relatedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },

}, { timestamps: true })

NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', NotificationSchema)
