const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String, unique: true,
    default: () => 'A' + Date.now().toString().slice(-6),
  },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:  { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  date:    { type: Date,   required: true },
  time:    { type: String, required: true },   // "09:00"
  duration:{ type: Number, default: 30 },       // minutes

  type: {
    type: String,
    enum: ['Routine', 'Follow-up', 'First Visit', 'Urgent', 'Emergency'],
    default: 'Routine',
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Waiting', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled',
  },

  room:        { type: String },
  notes:       { type: String },
  cancelReason:{ type: String },

  // Who booked it
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Reminder flags
  smsReminderSent:  { type: Boolean, default: false },
  emailReminderSent:{ type: Boolean, default: false },

}, { timestamps: true })

// Prevent double-booking: same doctor, same date+time
AppointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true, sparse: true })
AppointmentSchema.index({ patient: 1, date: 1 })
AppointmentSchema.index({ status: 1, date: 1 })

module.exports = mongoose.model('Appointment', AppointmentSchema)
