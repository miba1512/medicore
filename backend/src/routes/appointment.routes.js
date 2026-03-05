const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const Appointment = require('../models/Appointment.model')

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, status, doctor, patient, date } = req.query
        const filter = {}
        if (status) filter.status = status
        if (doctor) filter.doctor = doctor
        if (patient) filter.patient = patient
        if (date) filter.date = { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
        const data = await Appointment.find(filter)
            .populate('patient', 'name patientId').populate('doctor', 'name specialization')
            .sort({ date: 1, time: 1 }).skip((page - 1) * limit).limit(+limit)
        const total = await Appointment.countDocuments(filter)
        res.json({ success: true, data, total })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id', protect, async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id)
            .populate('patient').populate('doctor').populate('bookedBy', 'name')
        if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' })
        res.json({ success: true, data: appt })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/', protect, async (req, res) => {
    try {
        const appt = await Appointment.create({ ...req.body, bookedBy: req.user._id })
        res.status(201).json({ success: true, data: appt })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.put('/:id', protect, async (req, res) => {
    try {
        const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' })
        res.json({ success: true, data: appt })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.patch('/:id/cancel', protect, async (req, res) => {
    try {
        const appt = await Appointment.findByIdAndUpdate(req.params.id,
            { status: 'Cancelled', cancelReason: req.body.reason }, { new: true })
        if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' })
        res.json({ success: true, data: appt })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.patch('/:id/reschedule', protect, async (req, res) => {
    try {
        const { date, time } = req.body
        const appt = await Appointment.findByIdAndUpdate(req.params.id,
            { date, time, status: 'Scheduled' }, { new: true, runValidators: true })
        if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' })
        res.json({ success: true, data: appt })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

module.exports = router
