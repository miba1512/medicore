/**
 * ── Model barrel export ───────────────────────────────────────────────────────
 *  Import all Mongoose models from a single location:
 *
 *    const { User, Patient, Doctor } = require('./models')
 *
 *  Adding a new model?  Just add it here — server.js and schemas/index.js
 *  will both pick it up automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const User = require('./User.model')
const Patient = require('./Patient.model')
const Doctor = require('./Doctor.model')
const Appointment = require('./Appointment.model')
const Prescription = require('./Prescription.model')
const Consultation = require('./Consultation.model')
const MedicalRecord = require('./MedicalRecord.model')
const Billing = require('./Billing.model')
const Notification = require('./Notification.model')

module.exports = {
    User,
    Patient,
    Doctor,
    Appointment,
    Prescription,
    Consultation,
    MedicalRecord,
    Billing,
    Notification,
}
