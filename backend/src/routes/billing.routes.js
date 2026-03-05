const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const Billing = require('../models/Billing.model')

const router = express.Router()

router.get('/', protect, async (req, res) => {
    try {
        const { page = 1, limit = 20, patient, status } = req.query
        const filter = {}
        if (patient) filter.patient = patient
        if (status) filter.status = status
        const data = await Billing.find(filter)
            .populate('patient', 'name patientId').populate('doctor', 'name')
            .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit)
        const total = await Billing.countDocuments(filter)
        res.json({ success: true, data, total })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id', protect, async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id)
            .populate('patient').populate('doctor').populate('consultation')
        if (!bill) return res.status(404).json({ success: false, message: 'Billing record not found' })
        res.json({ success: true, data: bill })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.get('/:id/invoice', protect, async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id)
        if (!bill) return res.status(404).json({ success: false, message: 'Billing record not found' })
        if (bill.pdfUrl) return res.json({ success: true, url: bill.pdfUrl })
        res.status(404).json({ success: false, message: 'Invoice PDF not yet generated' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

router.post('/', protect, async (req, res) => {
    try {
        const bill = await Billing.create({ ...req.body, createdBy: req.user._id })
        res.status(201).json({ success: true, data: bill })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

router.patch('/:id/pay', protect, async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id)
        if (!bill) return res.status(404).json({ success: false, message: 'Billing record not found' })
        if (req.body.payment) bill.payments.push(req.body.payment)
        await bill.save()   // pre-save hook recalculates totals & status
        res.json({ success: true, data: bill })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

module.exports = router
