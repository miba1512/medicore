const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const Prescription = require('../models/Prescription.model')

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, patient, doctor, status } = req.query
        const filter = {}
        if (patient) filter.patient = patient
        if (doctor) filter.doctor = doctor
        if (status) filter.status = status
        const data = await Prescription.find(filter)
            .populate('patient', 'name patientId').populate('doctor', 'name specialization')
            .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit)
        const total = await Prescription.countDocuments(filter)
        res.json({ success: true, data, total })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id', protect, async (req, res) => {
    try {
        const rx = await Prescription.findById(req.params.id)
            .populate('patient').populate('doctor').populate('consultation')
        if (!rx) return res.status(404).json({ success: false, message: 'Prescription not found' })
        res.json({ success: true, data: rx })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id/pdf', protect, async (req, res) => {
    try {
        const rx = await Prescription.findById(req.params.id).populate('patient').populate('doctor')
        if (!rx) return res.status(404).json({ success: false, message: 'Prescription not found' })
        if (rx.pdfUrl) return res.json({ success: true, url: rx.pdfUrl })
        res.status(404).json({ success: false, message: 'PDF not yet generated' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/', protect, async (req, res) => {
    try {
        const rx = await Prescription.create(req.body)
        res.status(201).json({ success: true, data: rx })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.put('/:id', protect, async (req, res) => {
    try {
        const rx = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!rx) return res.status(404).json({ success: false, message: 'Prescription not found' })
        res.json({ success: true, data: rx })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

module.exports = router
