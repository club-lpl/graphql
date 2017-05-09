'use strict'

const { stripIndent: gql } = require('common-tags')
const { merge } = require('lodash')
const { makeExecutableSchema } = require('graphql-tools')
const { graphqlExpress } = require('graphql-server-express')
const { SubscriptionManager } = require('graphql-subscriptions')
const author = require('./author')
const book = require('./book')
const pubsub = require('./pubsub')

const rootSchema = gql`
  type Query {
    # Query the health of the service
    health: String
  }
  type Mutation {
    # Echo a message back to yourself
    echo(msg: String): String
  }
  type Subscription {
    tick: Float
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

setInterval(() => {
  pubsub.publish('tick', Date.now())
}, 1000)

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
  },
  Subscription: {
    tick (obj) {
      return obj
    }
  }
}

const schema = makeExecutableSchema({
  typeDefs: [rootSchema, author.schema, book.schema],
  resolvers: merge(rootResolvers, author.resolvers, book.resolvers)
})

exports.graphqlHandler = graphqlExpress(req => ({
  schema,
  context: merge({}, author.context(req), book.context(req))
}))
exports.subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: merge({}, author.subscriptionSetup, book.subscriptionSetup)
})
