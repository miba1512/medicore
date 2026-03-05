/**
 * ════════════════════════════════════════════════════════════
 *  MediCore — MongoDB Atlas Schema Reference
 *  Database: medicore
 * ════════════════════════════════════════════════════════════
 *
 *  Collections
 *  ───────────────────────────────────────────────────────────
 *  users            → System users (Admin, Doctor, Nurse, Receptionist)
 *  patients         → Patient registry & medical profile
 *  doctors          → Doctor directory & availability
 *  appointments     → Appointment bookings with slot management
 *  prescriptions    → Drug prescriptions with dosage
 *  consultations    → Live consultation notes & vitals (AI SOAP summary stored here)
 *  medicalrecords   → File attachments (Cloudinary-backed, AI summary stored here)
 *  billings         → Invoices & payment tracking
 *  notifications    → Per-user alert feed
 *
 *  Indexes (critical for performance)
 *  ───────────────────────────────────────────────────────────
 *  patients:         { name: "text", condition: "text", patientId: "text" }
 *                    { assignedDoctor: 1, status: 1 }
 *
 *  doctors:          { name: "text", specialization: "text" }
 *
 *  appointments:     { doctor: 1, date: 1, time: 1 }   ← unique, prevents double-booking
 *                    { patient: 1, date: 1 }
 *                    { status: 1, date: 1 }
 *
 *  prescriptions:    { patient: 1, status: 1 }
 *                    { doctor: 1, createdAt: -1 }
 *
 *  consultations:    { patient: 1, date: -1 }
 *                    { doctor: 1, date: -1 }
 *
 *  medicalrecords:   { patient: 1, type: 1 }
 *                    { patient: 1, tag: 1 }
 *
 *  billings:         { patient: 1, status: 1 }
 *                    { createdAt: -1 }
 *
 *  notifications:    { recipient: 1, read: 1, createdAt: -1 }
 *
 *  Relationships (all refs → ObjectId)
 *  ───────────────────────────────────────────────────────────
 *  Doctor          → User          (1:1)
 *  Patient         → Doctor        (N:1  assignedDoctor)
 *  Appointment     → Patient       (N:1)
 *  Appointment     → Doctor        (N:1)
 *  Prescription    → Patient       (N:1)
 *  Prescription    → Doctor        (N:1)
 *  Prescription    → Consultation  (N:1  optional)
 *  Consultation    → Patient       (N:1)
 *  Consultation    → Doctor        (N:1)
 *  Consultation    → Appointment   (1:1  optional)
 *  Consultation    → MedicalRecord (N:M  attachments[])
 *  MedicalRecord   → Patient       (N:1)
 *  MedicalRecord   → Doctor        (N:1  optional)
 *  Billing         → Patient       (N:1)
 *  Billing         → Doctor        (N:1  optional)
 *  Billing         → Consultation  (1:1  optional)
 *  Notification    → User          (N:1  recipient)
 *
 *  AI Integration (ANTHROPIC_API_KEY)
 *  ───────────────────────────────────────────────────────────
 *  Consultation.aiSoapSummary   → AI-generated SOAP note summary
 *  Consultation.aiGeneratedAt   → Timestamp of last AI generation
 *  Prescription.aiSummary       → AI-generated prescription summary
 *  MedicalRecord.aiSummary      → AI-generated report interpretation
 *
 *  Environment Variables Required
 *  ───────────────────────────────────────────────────────────
 *  MONGO_URI                  mongodb+srv://<user>:<pass>@cluster.mongodb.net
 *  JWT_SECRET                 <min 32 char random string>
 *  JWT_EXPIRES_IN             7d
 *  ANTHROPIC_API_KEY          sk-ant-...   (AI SOAP & prescription summaries)
 *  CLOUDINARY_CLOUD_NAME      ...
 *  CLOUDINARY_API_KEY         ...
 *  CLOUDINARY_API_SECRET      ...
 *  CLIENT_URL                 http://localhost:5173
 *  PORT                       5000
 * ════════════════════════════════════════════════════════════
 */

const path = require('path')

// ── Declared collections (ground-truth for this file) ────────────────────────
const DECLARED_COLLECTIONS = [
  'users',
  'patients',
  'doctors',
  'appointments',
  'prescriptions',
  'consultations',
  'medicalrecords',
  'billings',
  'notifications',
]

// ── Derive actual collection names from registered Mongoose models ────────────
function getRegisteredCollections() {
  // Lazy-require so this file can be loaded without mongoose being connected
  const models = require(path.resolve(__dirname, '../../backend/src/models'))
  return Object.values(models).map(m => m.collection.collectionName).sort()
}

/**
 * Validates that every declared collection has a matching Mongoose model and
 * vice-versa.  Call this once at startup (after connectDB) to catch drift early.
 *
 * @throws {Error} if the declared list and the registered models are out of sync
 */
function validateSchema() {
  const registered = getRegisteredCollections()
  const declared = [...DECLARED_COLLECTIONS].sort()

  const missing = declared.filter(c => !registered.includes(c))
  const undeclared = registered.filter(c => !declared.includes(c))

  if (missing.length || undeclared.length) {
    const lines = ['[medicore/schemas] Schema drift detected!']
    if (missing.length) lines.push(`  ✖  Declared but no model found : ${missing.join(', ')}`)
    if (undeclared.length) lines.push(`  ✖  Model exists but undeclared : ${undeclared.join(', ')}`)
    lines.push('  → Update DECLARED_COLLECTIONS in database/schemas/index.js')
    throw new Error(lines.join('\n'))
  }

  console.log(`[medicore/schemas] ✔  ${declared.length} collections validated`)
}

module.exports = {
  /** Canonical list of MongoDB collection names used by MediCore */
  collections: DECLARED_COLLECTIONS,

  /**
   * Run once at startup (after DB connect) to assert models ↔ declared list.
   *
   * Usage in server.js / connectDB:
   *   const { validateSchema } = require('../../database/schemas')
   *   validateSchema()
   */
  validateSchema,
}
