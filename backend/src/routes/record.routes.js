const express    = require('express')
const multer     = require('multer')
const cloudinary = require('cloudinary').v2
const { protect, authorize } = require('../middleware/auth.middleware')
const MedicalRecord = require('../models/MedicalRecord.model')

const router = express.Router()
router.use(protect)

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer — store in memory, stream to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 50 * 1024 * 1024 },  // 50 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','application/pdf','application/dicom']
    cb(null, allowed.includes(file.mimetype))
  },
})

// GET /api/records?patient=&tag=&type=
router.get('/', async (req, res) => {
  try {
    const { patient, tag, type, page=1, limit=20 } = req.query
    const filter = {}
    if (patient) filter.patient = patient
    if (tag)     filter.tag = tag
    if (type)    filter.type = type

    const [total, records] = await Promise.all([
      MedicalRecord.countDocuments(filter),
      MedicalRecord.find(filter)
        .populate('patient', 'name patientId')
        .populate('doctor',  'name')
        .sort({ createdAt: -1 })
        .skip((page-1)*limit).limit(Number(limit)),
    ])

    res.json({ success: true, total, data: records })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/records/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })

  try {
    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'medicore/records', resource_type: 'auto' },
        (err, result) => err ? reject(err) : resolve(result)
      )
      stream.end(req.file.buffer)
    })

    const record = await MedicalRecord.create({
      ...req.body,
      fileUrl:      result.secure_url,
      filePublicId: result.public_id,
      mimeType:     req.file.mimetype,
      sizeBytes:    req.file.size,
      uploadedBy:   req.user._id,
    })

    res.status(201).json({ success: true, data: record })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/records/:id
router.delete('/:id', authorize('admin','doctor'), async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' })

    // Remove from Cloudinary
    if (record.filePublicId) {
      await cloudinary.uploader.destroy(record.filePublicId, { resource_type: 'auto' })
    }

    await record.deleteOne()
    res.json({ success: true, message: 'Record deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router
