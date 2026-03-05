const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Name is required'], trim: true,
  },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  password: {
    type: String, required: true, minlength: 8, select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist'],
    default: 'receptionist',
  },
  avatar:      { type: String },
  phone:       { type: String },
  isActive:    { type: Boolean, default: true },
  lastLogin:   { type: Date },
  twoFASecret: { type: String, select: false },
  twoFAEnabled:{ type: Boolean, default: false },
}, { timestamps: true })

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('User', UserSchema)
