const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const Doctor = require('../models/Doctor.model')

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query
        const filter = search ? { $text: { $search: search } } : {}
        const doctors = await Doctor.find(filter).populate('user', 'name email avatar phone isActive')
            .skip((page - 1) * limit).limit(+limit)
        const total = await Doctor.countDocuments(filter)
        res.json({ success: true, data: doctors, total, page: +page })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id', protect, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name email avatar phone')
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
        res.json({ success: true, data: doctor })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id/schedule', protect, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id, 'availability name')
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
        res.json({ success: true, data: doctor.availability })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/', protect, async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body)
        res.status(201).json({ success: true, data: doctor })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.put('/:id', protect, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' })
        res.json({ success: true, data: doctor })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

module.exports = router
