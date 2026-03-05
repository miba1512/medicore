const express = require('express')
const jwt     = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User    = require('../models/User.model')
const { protect } = require('../middleware/auth.middleware')

const router = express.Router()

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/register
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['admin','doctor','nurse','receptionist']),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  try {
    const exists = await User.findOne({ email: req.body.email })
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' })

    const user  = await User.create(req.body)
    const token = signToken(user._id)
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() })

  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account deactivated' })

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    const token = signToken(user._id)
    res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role, email: user.email } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user })
})

// POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.json({ success: true, message: 'Logged out' })
})

module.exports = router
