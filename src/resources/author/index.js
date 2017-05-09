'use strict'

const { stripIndent: gql } = require('common-tags')
const _ = require('lodash')
const DataLoader = require('dataloader')
const mongodb = require('mongodb')
const pubsub = require('../pubsub')

exports.context = req => {
  const authorsCollection = req.db.collection('authors')
  const Author = new DataLoader(async ids => {
    const objectIds = ids.map(mongodb.ObjectID)
    const authors = await authorsCollection
      .find({ _id: { $in: objectIds } })
      .toArray()

    authors.sort(
      (a, b) => (_.findIndex(ids, a) > _.findIndex(ids, b) ? 1 : -1)
    )
    return authors
  })

  return {
    authorsCollection,
    Author
  }
}

exports.schema = gql`
  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String
    literature: [Literature]
  }

  extend type Query {
    authors: [Author]
    author(id: ID!): Author
  }

  extend type Mutation {
    createAuthor(
      firstName: String!
      lastName: String!
    ): Author
  }

  extend type Subscription {
    authorCreated(name: String): Author
  }
`

exports.resolvers = {
  Query: {
    authors (obj, args, ctx) {
      return ctx.authorsCollection.find({}).toArray()
    },
    author (obj, args, ctx) {
      return ctx.Author.load(args.id)
    }
  },
  Mutation: {
    async createAuthor (obj, args, ctx) {
      const { ops: [document] } = await ctx.authorsCollection.insertOne(args)
      pubsub.publish('authorCreated', document)
      return document
    }
  },
  Subscription: {
    authorCreated: obj => obj
  },
  Author: {
    id: obj => obj._id,
    fullName (obj) {
      return `${obj.firstName} ${obj.lastName}`
    },
    literature (obj, args, ctx) {
      return ctx.booksCollection.find({ authorId: obj._id }).toArray()
    }
  }
}

exports.subscriptionSetup = {
  authorCreated: (options, args) => {
    return {
      authorCreated: {
        filter: author => {
          if (!args.name) return true
          const nameMatcher = new RegExp(`${args.name}`, 'i')
          return (
            nameMatcher.test(author.firstName) ||
            nameMatcher.test(author.lastName)
          )
        }
      }
    }
  }
}
