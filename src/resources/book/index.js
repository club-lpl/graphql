'use strict'

const { stripIndent: gql } = require('common-tags')
const _ = require('lodash')
const DataLoader = require('dataloader')
const mongodb = require('mongodb')

exports.context = req => {
  const booksCollection = req.db.collection('books')
  const Book = new DataLoader(async ids => {
    const objectIds = ids.map(mongodb.ObjectID)
    const books = await booksCollection
      .find({ _id: { $in: objectIds } })
      .toArray()

    books.sort((a, b) => (_.findIndex(ids, a) > _.findIndex(ids, b) ? 1 : -1))
    return books
  })

  return {
    booksCollection,
    Book
  }
}

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
    type: LiteratureType!
  }

  type Novel implements Literature {
    id: ID!
    title: String!
    genre: String
    author: Author
    type: LiteratureType!
  }

  interface Literature {
    id: ID!
    title: String!
    author: Author
    type: LiteratureType!
  }

  enum LiteratureType {
    Novel
    Book
  }

  extend type Query {
    literature: [Literature]
    book(id: ID!): Book
    literature: [Literature]
  }

  extend type Mutation {
    createLiterature(
      title: String!
      authorId: ID!
      isbn: String
      pageCount: Int
      rating: Int
      published: Boolean
      tags: [String]
      type: LiteratureType!
      genre: String
    ): Literature
  }
`

exports.resolvers = {
  Query: {
    literature (obj, args, ctx) {
      return ctx.booksCollection.find({}).toArray()
    },
    book (obj, args, ctx) {
      return ctx.Book.load(args.id)
    }
  },
  Mutation: {
    async createLiterature (obj, args, ctx) {
      const documentToInsert = Object.assign({}, args, {
        authorId: mongodb.ObjectID(args.authorId)
      })
      const { ops: [document] } = await ctx.booksCollection.insertOne(
        documentToInsert
      )
      return document
    }
  },
  Book: {
    id: obj => obj._id,
    author (obj, args, ctx) {
      return ctx.Author.load(obj.authorId.toString())
    }
  },
  Novel: {
    id: obj => obj._id,
    author (obj, args, ctx) {
      return ctx.Author.load(obj.authorId.toString())
    }
  },
  Literature: {
    __resolveType (obj, ctx, info) {
      return obj.type || null
    }
  }
}
