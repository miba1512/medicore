const express  = require('express')
const Patient  = require('../models/Patient.model')
const { protect, authorize } = require('../middleware/auth.middleware')

const router = express.Router()
router.use(protect)

// GET /api/patients?page=1&limit=20&status=Active&search=
router.get('/', async (req, res) => {
  try {
    const { page=1, limit=20, status, search, doctor } = req.query
    const filter = {}
    if (status)  filter.status = status
    if (doctor)  filter.assignedDoctor = doctor
    if (search)  filter.$text = { $search: search }

    const total    = await Patient.countDocuments(filter)
    const patients = await Patient.find(filter)
      .populate('assignedDoctor', 'name specialization')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({ success: true, total, page: Number(page), data: patients })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/patients/search?q=
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    const patients = await Patient.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { patientId: { $regex: q, $options: 'i' } },
        { condition: { $regex: q, $options: 'i' } },
      ]
    }).limit(10).select('patientId name condition status')
    res.json({ success: true, data: patients })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/patients/:id
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor')
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' })
    res.json({ success: true, data: patient })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/patients
router.post('/', authorize('admin', 'doctor', 'nurse', 'receptionist'), async (req, res) => {
  try {
    const patient = await Patient.create(req.body)
    res.status(201).json({ success: true, data: patient })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// PUT /api/patients/:id
router.put('/:id', authorize('admin', 'doctor', 'nurse'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' })
    res.json({ success: true, data: patient })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// DELETE /api/patients/:id — Admin only
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Patient removed' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
