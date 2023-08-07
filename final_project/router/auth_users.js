const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let usersWithSameNmae = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameNmae.length > 0) {
    return true;
  } else {
    return false;
  }
};
const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUser = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username: username }, 'your-secret-key', {
      expiresIn: '1h', // Token expiration time
    });

    return res
      .status(200)
      .json({ message: 'Login successful', accessToken: accessToken });
  }

  return res.status(401).json({ message: 'Invalid login credentials' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // Get the username from the user's session

  if (!isbn || !review) {
    return res
      .status(400)
      .json({ message: 'ISBN and review query parameters are required' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or modify the review based on the current user
  books[isbn].reviews[username] = review;

  return res
    .status(200)
    .json({ message: 'Review added or modified successfully' });
  //return res.status(300).json({ message: 'Yet to be implemented' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Get the username from the user's session

  if (!isbn) {
    return res.status(400).json({ message: 'ISBN parameter is required' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res
      .status(404)
      .json({ message: 'Review not found for the given user and ISBN' });
  }

  // Delete the user's review for the specified ISBN
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
