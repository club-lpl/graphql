'use strict'

const gql = require('graphql-tag')
const data = require('../data')

exports.schema = gql`
  type Book {
    id: ID!
    title: String!
    author: Author!
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
      return data.getBook(args.id)
    }
  },
  Mutation: {
    createBook (obj, args, ctx) {
      return data.createBook(args)
    }
  },
  Book: {
    author (obj) {
      return data.getAuthor(obj.authorId)
    }
  }
}
