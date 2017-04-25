'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const schema = require('./resources')
const DataLoader = require('dataloader')
const data = require('./resources/data')
const mongodb = require('mongodb')
const { findIndex } = require('lodash')

const app = express()
const user = {
  firstName: 'Jack',
  perms: ['book', 'books', 'author', 'authors']
}

app.use(async (req, res, next) => {
  try {
    const db = await mongodb.MongoClient.connect(
      'mongodb://localhost:27017/shh'
    )
    req.db = db
  } catch (stupid) {
    return next(stupid)
  }
  return next()
})

app.use('/graphql', [
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      authorsLoader: new DataLoader(async ids => {
        console.log(ids)
        const objectIds = ids.map(mongodb.ObjectID)
        const authors = await req.db
          .collection('authors')
          .find({ _id: { $in: objectIds } })
          .toArray()

        authors.sort((a, b) => findIndex(ids, a) > findIndex(ids, b) ? 1 : -1)
        return authors
      }),
      user
    },
    formatError (error) {
      if (error.message === 'NotFound') {
        console.log(error.stack)
        return {
          message: 'Unauthorized',
          locations: error.locations,
          stack: error.stack,
          path: error.path
        }
      }
      return error
    }
  }))
])
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql'
  })
)

module.exports = app
