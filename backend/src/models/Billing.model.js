const mongoose = require('mongoose')

const ServiceLineSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  code:     { type: String },           // CPT / procedure code
  quantity: { type: Number, default: 1 },
  unitPrice:{ type: Number, required: true },
  amount:   { type: Number, required: true },
}, { _id: false })

const PaymentSchema = new mongoose.Schema({
  amount:    Number,
  method:    { type: String, enum: ['Cash','Card','UPI','Insurance','Other'] },
  reference: String,
  paidAt:    { type: Date, default: Date.now },
}, { _id: false })

const BillingSchema = new mongoose.Schema({
  invoiceId: {
    type: String, unique: true,
    default: () => 'INV-' + new Date().getFullYear() + '-' + Math.floor(Math.random()*9000+1000),
  },
  patient:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:       { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  consultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },

  services:    { type: [ServiceLineSchema], validate: v => v.length > 0 },
  subtotal:    { type: Number },
  discount:    { type: Number, default: 0 },
  tax:         { type: Number, default: 0 },
  total:       { type: Number },

  status: {
    type: String,
    enum: ['Draft', 'Unpaid', 'Partial', 'Paid', 'Cancelled', 'Refunded'],
    default: 'Unpaid',
  },

  payments:      [PaymentSchema],
  amountPaid:    { type: Number, default: 0 },
  amountDue:     { type: Number },

  notes:         { type: String },
  pdfUrl:        { type: String },

  dueDate:       { type: Date },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })

// Auto-calculate totals before save
BillingSchema.pre('save', function (next) {
  this.subtotal   = this.services.reduce((s, l) => s + l.amount, 0)
  this.total      = this.subtotal - this.discount + this.tax
  this.amountPaid = this.payments.reduce((s, p) => s + p.amount, 0)
  this.amountDue  = this.total - this.amountPaid
  if (this.amountDue <= 0)          this.status = 'Paid'
  else if (this.amountPaid > 0)     this.status = 'Partial'
  next()
})

BillingSchema.index({ patient: 1, status: 1 })
BillingSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Billing', BillingSchema)
