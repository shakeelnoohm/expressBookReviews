const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users[username] = { password }; // Add the new user to the users object
  
    // Respond with success message
    return res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Convert books data to a JSON string for a neatly formatted response
    const booksList = JSON.stringify(books, null, 2); // Pretty print with 2-space indentation
  
    return res.status(200).send(booksList); // Send the books list as the response
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Check if the book exists in the JSON
    if (books[isbn]) {
      return res.status(200).json(books[isbn]); // Return the book details if found
    } else {
      return res.status(404).json({ message: "Book not found" }); // Error if not found
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Retrieve the author from the request parameters
    const { author } = req.params;
  
    // Obtain all the keys of the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' object to find books by the specified author
    const booksByAuthor = [];
    bookKeys.forEach(key => {
      if (books[key].author === author) {
        booksByAuthor.push(books[key]);
      }
    });
  
    // Check if any books by the author were found
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor); // Return the matching books
    } else {
      return res.status(404).json({ message: "No books found for the given author" }); // No books found
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // Retrieve the title from the request parameters
    const { title } = req.params;
  
    // Obtain all the keys of the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' object to find books by the specified title
    const booksByTitle = [];
    bookKeys.forEach(key => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle.push(books[key]);
      }
    });
  
    // Check if any books with the specified title were found
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); // Return the matching books
    } else {
      return res.status(404).json({ message: "No books found with the given title" }); // No books found
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // Retrieve the ISBN from the request parameters
    const { isbn } = req.params;
  
    // Check if the book exists for the given ISBN
    if (books[isbn]) {
      const bookReviews = books[isbn].reviews;
      return res.status(200).json(bookReviews); // Return the reviews for the book
    } else {
      return res.status(404).json({ message: "Book not found" }); // Book not found
    }
  });
  

module.exports.general = public_users;
