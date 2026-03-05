const mongoose = require('mongoose')
const dns = require('dns')

// Force Google/Cloudflare DNS — system resolver blocks MongoDB SRV lookups
dns.setServers(['8.8.8.8', '1.1.1.1'])

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'medicore',
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'))
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'))

module.exports = connectDB
