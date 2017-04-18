'use strict'

const gql = require('graphql-tag')
const data = require('../data')

exports.schema = gql`
  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String
    books: [Book]
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
`

exports.resolvers = {
  Query: {
    authors (obj, args, ctx) {
      return data.getAuthors()
    },
    author (obj, args, ctx) {
      return data.getAuthor(args.id)
    }
  },
  Mutation: {
    createAuthor (obj, args, ctx) {
      return data.createAuthor(args)
    }
  },
  Author: {
    fullName (obj) {
      return `${obj.firstName} ${obj.lastName}`
    },
    books (obj) {
      return data.getBooksByAuthor(obj.id)
    }
  }
}
