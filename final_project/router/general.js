const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      return res.status(404).send({ message: 'Username already' });
    } else {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .send({ message: 'Username successfully registered' });
    }
  }
  return res
    .status(300)
    .json({ message: 'Username and/or password can not be empty' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  const bookList = Object.values(books).map((book) => ({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
  }));
  return res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: 'ISBN parameter is missing' });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json({ book });
  //return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  if (!author) {
    return res.status(400).json({ message: 'Author parameter is missing' });
  }

  const matchingBooks = Object.values(books).filter((book) => {
    return book.author === author;
  });

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: 'No books found', author: author });
  }

  return res.status(200).json({ books: matchingBooks });
  //return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  if (!title) {
    return res.status(400).json({ message: 'Title parameter is missing' });
  }

  const matchingBooks = Object.values(books).filter((book) => {
    return book.title.toLowerCase().includes(title.toLowerCase());
  });

  if (matchingBooks.length === 0) {
    return res
      .status(404)
      .json({ message: 'No books found with the provided title' });
  }

  return res.status(200).json({ books: matchingBooks });
  //return res.status(300).json({ message: 'Yet to be implemented' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ message: 'ISBN parameter is missing' });
  }

  const book = Object.values(books).find((book) => book.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const reviews = book.reviews || {};

  return res.status(200).json({ reviews });
  //return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
