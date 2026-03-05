require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const { validateSchema } = require('../../database/schemas')

// ── Route imports ────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes')
const patientRoutes = require('./routes/patient.routes')
const doctorRoutes = require('./routes/doctor.routes')
const appointmentRoutes = require('./routes/appointment.routes')
const prescriptionRoutes = require('./routes/prescription.routes')
const consultationRoutes = require('./routes/consultation.routes')
const recordRoutes = require('./routes/record.routes')
const billingRoutes = require('./routes/billing.routes')
const aiRoutes = require('./routes/ai.routes')
const notificationRoutes = require('./routes/notification.routes')

const app = express()

// ── Connect DB ────────────────────────────────────────────────
connectDB()
validateSchema()

// ── Middleware ────────────────────────────────────────────────
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(cors({
  origin: (origin, callback) => {
    // Allow Vercel urls, localhost, and exact CLIENT_URL match
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin === process.env.CLIENT_URL) {
      callback(null, true)
    } else {
      callback(new Error('Blocked by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Rate limiting ─────────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 })
app.use('/api/', limiter)
app.use('/api/auth/', authLimiter)

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/notifications', notificationRoutes)

// ── Health check ──────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', version: '3.0.0', uptime: process.uptime() }))

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 MediCore API running on port ${PORT}`))

module.exports = app
