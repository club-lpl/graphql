'use strict'

const gql = require('graphql-tag')
const { merge } = require('lodash')
const { makeExecutableSchema } = require('graphql-tools')
const author = require('./author')
const book = require('./book')

const rootSchema = gql`
  type Query {
    health: String
  }
  type Mutation {
    echo(msg: String): String
  }
  schema {
    query: Query
    mutation: Mutation
  }
`

const rootResolvers = {
  Query: {
    health () {
      return 'ok'
    }
  },
  Mutation: {
    echo (obj, args, ctx) {
      return args.msg
    }
  }
}

module.exports = makeExecutableSchema({
  typeDefs: [
    rootSchema,
    author.schema,
    book.schema
  ],
  resolvers: merge(
    rootResolvers,
    author.resolvers,
    book.resolvers
  )
})
