'use strict'

const app = require('./src/app')

const PORT = process.env.PORT || 8000

app
  .listen(PORT)
  .on('listening', () => console.log(`Server listening on port ${PORT}`))
  .on('error', err => console.log('Error starting up server', err))
