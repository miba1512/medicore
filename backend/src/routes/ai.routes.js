const express    = require('express')
const Anthropic  = require('@anthropic-ai/sdk')
const { protect } = require('../middleware/auth.middleware')
const Patient    = require('../models/Patient.model')

const router  = express.Router()
const claude  = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.use(protect)

const SYSTEM_PROMPT = `You are MediCore AI, an advanced clinical decision support assistant embedded in a hospital management system. You assist licensed medical professionals with:
- Differential diagnosis based on symptoms and patient history
- Drug interaction checking and prescription suggestions
- Treatment protocol recommendations
- Medical note summarization (SOAP format)
- Lab result interpretation

Rules:
- Be concise, structured, and medically accurate
- Flag urgent/critical findings clearly with ⚠️
- Note contraindications based on patient allergies
- Always remind that suggestions require physician review
- Never refuse medical questions from authenticated clinical staff`

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { messages, patientId } = req.body

    let systemPrompt = SYSTEM_PROMPT

    // Inject patient context if provided
    if (patientId) {
      const patient = await Patient.findById(patientId).populate('assignedDoctor', 'name')
      if (patient) {
        systemPrompt += `\n\n[ACTIVE PATIENT CONTEXT]
Name: ${patient.name} | Age: ${patient.age} | Gender: ${patient.gender}
Blood Type: ${patient.blood} | Condition: ${patient.condition}
Allergies: ${patient.allergies?.join(', ') || 'None known'}
Chronic Diseases: ${patient.chronicDiseases?.join(', ') || 'None'}
Current Medications: ${patient.currentMeds?.join(', ') || 'None'}
History: ${patient.history || 'N/A'}`
      }
    }

    const response = await claude.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     systemPrompt,
      messages:   messages.map(m => ({ role: m.role, content: m.content })),
    })

    res.json({
      success: true,
      reply:   response.content[0].text,
      usage:   response.usage,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/ai/search  — natural language search over clinic data
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body

    // Gather live counts from DB for context
    const [patientCount, criticalCount] = await Promise.all([
      Patient.countDocuments(),
      Patient.countDocuments({ status: 'Critical' }),
    ])

    const response = await claude.messages.create({
      model:     'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: `You are MediCore's intelligent search assistant. Answer questions about the clinic concisely.
Context: Total patients: ${patientCount}. Critical patients: ${criticalCount}.`,
      messages: [{ role: 'user', content: query }],
    })

    res.json({ success: true, answer: response.content[0].text })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/ai/summarise-consultation  — SOAP summary
router.post('/summarise-consultation', async (req, res) => {
  try {
    const { symptoms, diagnosis, vitals, notes, plan, patient } = req.body

    const response = await claude.messages.create({
      model:     'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: 'You are a senior clinical documentation assistant. Produce a concise SOAP-style clinical summary in 3-5 sentences. Be professional and medically precise.',
      messages: [{
        role: 'user',
        content: `Patient: ${patient} | Symptoms: ${symptoms} | Diagnosis: ${diagnosis} | Vitals: BP ${vitals?.bp}, HR ${vitals?.hr}, Temp ${vitals?.temp}, SpO2 ${vitals?.spo2} | Notes: ${notes} | Plan: ${plan}`,
      }],
    })

    res.json({ success: true, summary: response.content[0].text })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/ai/summarise-record
router.post('/summarise-record', async (req, res) => {
  try {
    const { name, type, patient, date } = req.body

    const response = await claude.messages.create({
      model:     'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: 'You are a medical records analyst. Write a brief 2-3 sentence clinical summary of the document and its clinical significance.',
      messages: [{ role: 'user', content: `Document: ${name} | Type: ${type} | Patient: ${patient} | Date: ${date}` }],
    })

    res.json({ success: true, summary: response.content[0].text })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
