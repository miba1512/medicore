const express = require('express')
const { protect } = require('../middleware/auth.middleware')
const Notification = require('../models/Notification.model')

const router = express.Router()

// GET /api/notifications  — current user's feed
router.get('/', protect, async (req, res) => {
    try {
        const data = await Notification.find({ recipient: req.user._id, dismissed: false })
            .sort({ createdAt: -1 }).limit(50)
        res.json({ success: true, data })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
})

// PATCH /api/notifications/:id/dismiss
router.patch('/:id/dismiss', protect, async (req, res) => {
    try {
        const n = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { dismissed: true }, { new: true })
        if (!n) return res.status(404).json({ success: false, message: 'Notification not found' })
        res.json({ success: true, data: n })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

// PATCH /api/notifications/mark-all-read
router.patch('/mark-all-read', protect, async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true })
        res.json({ success: true, message: 'All notifications marked as read' })
    } catch (err) { res.status(400).json({ success: false, message: err.message }) }
})

module.exports = router
