'use strict'

const { stripIndent: gql } = require('common-tags')
const data = require('../data')

exports.schema = gql`
  # ## Get rekt
  # - How to get Rekt
  # - Probably Not
  # Lets be honest
  type Book {
    id: ID!
    title: String!
    author: Author
    isbn: String
    pageCount: Int
    rating: Int
    published: Boolean
    tags: [String]
  }

  extend type Query {
    books: [Book]
    book(id: ID!): Book
  }

  extend type Mutation {
    createBook(
      title: String!
      authorId: ID!
      isbn: String
      pageCount: Int
      rating: Int
      published: Boolean
      tags: [String]
    ): Book
  }
`

exports.resolvers = {
  Query: {
    books (obj, args, ctx) {
      return data.getBooks()
    },
    book (obj, args, ctx) {
      return data.getBook(args.id, ctx.user)
    }
  },
  Mutation: {
    createBook (obj, args, ctx) {
      return data.createBook(args)
    }
  },
  Book: {
    author (obj, args, ctx) {
      return ctx.authorsLoader.load(obj.authorId)
    },

    rating (obj, args, ctx) {
      return obj.rating
    }
  }
}
