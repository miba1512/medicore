const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const Consultation = require('../models/Consultation.model')

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, patient, doctor } = req.query
        const filter = {}
        if (patient) filter.patient = patient
        if (doctor) filter.doctor = doctor
        const data = await Consultation.find(filter)
            .populate('patient', 'name patientId').populate('doctor', 'name specialization')
            .sort({ date: -1 }).skip((page - 1) * limit).limit(+limit)
        const total = await Consultation.countDocuments(filter)
        res.json({ success: true, data, total })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id', protect, async (req, res) => {
    try {
        const c = await Consultation.findById(req.params.id)
            .populate('patient').populate('doctor').populate('appointment').populate('attachments')
        if (!c) return res.status(404).json({ success: false, message: 'Consultation not found' })
        res.json({ success: true, data: c })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/', protect, async (req, res) => {
    try {
        const c = await Consultation.create(req.body)
        res.status(201).json({ success: true, data: c })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.put('/:id', protect, async (req, res) => {
    try {
        const c = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!c) return res.status(404).json({ success: false, message: 'Consultation not found' })
        res.json({ success: true, data: c })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

// POST /api/consultations/:id/summarise — AI SOAP summary
router.post('/:id/summarise', protect, async (req, res) => {
    try {
        const c = await Consultation.findById(req.params.id).populate('patient', 'name age').populate('doctor', 'name')
        if (!c) return res.status(404).json({ success: false, message: 'Consultation not found' })

        const Anthropic = require('@anthropic-ai/sdk')
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

        const prompt = `Generate a concise SOAP note summary for the following consultation:
Patient: ${c.patient?.name}, Doctor: ${c.doctor?.name}
Symptoms: ${c.symptoms}
Diagnosis: ${c.diagnosis}
Notes: ${c.notes || 'N/A'}
Plan: ${c.plan || 'N/A'}
Format as: Subjective, Objective, Assessment, Plan`

        const message = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 512,
            messages: [{ role: 'user', content: prompt }],
        })

        c.aiSoapSummary = message.content[0].text
        c.aiGeneratedAt = new Date()
        await c.save()
        res.json({ success: true, data: c })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

module.exports = router
