'use strict'

const { stripIndent: gql } = require('common-tags')
const data = require('../data')

exports.schema = gql`
  # ## Get rekt
  # - How to get Rekt
  # - Probably Not
  # Lets be honest
  type Book implements Literature {
    id: ID!
    title: String!
    author: Author
    isbn: String
    pageCount: Int
    rating: Int
    published: Boolean
    tags: [String]
    type: String
  }

  type Novel implements Literature {
    id: ID!
    title: String!
    genre: String!
    type: String
  }

  interface Literature {
    id: ID!
    title: String!
  }

  extend type Query {
    books: [Book]
    book(id: ID!): Book
    literature: [Literature]
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
    },
    literature (obj, args, ctx) {
      return [
        {
          id: 13,
          title: 'Best Book',
          isbn: '123333',
          type: 'Book'
        },
        {
          id: 15,
          title: 'Best Book',
          type: 'Book'
        },
        {
          id: 14,
          title: 'Best Novel',
          genre: 'Horror',
          type: 'Novel'
        }
      ]
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
    },

    isbn (obj, args, ctx) {
      if (!obj.isbn) throw new Error('NotFound')
      return obj.isbn
    }
  },
  Literature: {
    __resolveType (obj, ctx, info) {
      return obj.type || null
    }
  }
}
