'use strict'

// THIS IS FOR DEMONSTRATION PURPOSES ONLY. YOU SHOULD USE A BIG BOY DATABASE.

let autoId = 0
const books = []
const booksIndex = {}
const authors = []
const authorsIndex = {}

exports.getBooks = () => books
exports.getBook = (id) => booksIndex[id]
exports.getBooksByAuthor = (authorId) => {
  return books.filter((book) => book.authorId === authorId)
}
exports.createBook = (obj) => {
  obj.id = `${autoId++}`
  books.push(obj)
  booksIndex[obj.id] = obj
  return obj
}

exports.getAuthors = () => authors
exports.getAuthor = (id) => authorsIndex[id]
exports.createAuthor = (obj) => {
  obj.id = `${autoId++}`
  authors.push(obj)
  authorsIndex[obj.id] = obj
  return obj
}

// Seed the database
(() => {
  const author = exports.createAuthor({
    firstName: 'Jack',
    lastName: 'Bliss'
  })
  exports.createBook({
    title: 'How GraphQL changed the world',
    authorId: author.id,
    isbn: '1337',
    pageCount: 42,
    rating: 5,
    published: true,
    tags: [ 'graphql' ]
  })
})()
