import { config } from 'dotenv'
import { connect } from 'mongoose'

config()

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/bonlivre'

connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
