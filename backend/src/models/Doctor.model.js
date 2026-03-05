const mongoose = require('mongoose')

const SlotSchema = new mongoose.Schema({
  day:       { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  startTime: String,   // "09:00"
  endTime:   String,   // "17:00"
  maxSlots:  { type: Number, default: 20 },
}, { _id: false })

const DoctorSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:       { type: String, unique: true, default: () => 'DR' + Date.now().toString().slice(-5) },
  name:           { type: String, required: true, trim: true, index: true },
  specialization: { type: String, required: true },
  qualification:  [{ type: String }],
  experience:     { type: Number },           // years
  consultationFee:{ type: Number },
  phone:          { type: String },
  email:          { type: String },
  bio:            { type: String },
  avatar:         { type: String },

  availability: [SlotSchema],

  // Ratings
  totalRatings: { type: Number, default: 0 },
  avgRating:    { type: Number, default: 0, min: 0, max: 5 },

  isActive: { type: Boolean, default: true },

}, { timestamps: true })

DoctorSchema.index({ name: 'text', specialization: 'text' })

module.exports = mongoose.model('Doctor', DoctorSchema)
