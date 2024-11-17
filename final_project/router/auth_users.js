const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [
    {
      username: "user",
      password: "password" // This is a plain text password for temporary use
    }
  ];  // This will store users temporarily; ideally, use a database

// Check if the username is valid (exists in the users array)
const isValid = (username) => {
    return users.some(user => user.username === username);  // Return true if username exists
};

// Check if the username and password match
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && user.password === password;  // Return true if user exists and password matches
};

// Secret key for JWT token signing (use the same key across the app)
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Username not found" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token with username as the payload and set an expiration time of 1 hour
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    // Save the token in the session for later use
    req.session.token = token;

    return res.status(200).json({
        message: "Login successful",
        token: token  // Return the token to the client
    });
});

regd_users.post("/review/:isbn", (req, res) => {
    const { isbn } = req.params;  // Get the ISBN from the URL parameter
    const { review } = req.query;  // Get the review text from the query string
    const username = req.session.username;  // Get the logged-in user's username from the session
  
    // Check if username is logged in
    if (!username) {
      return res.status(401).json({ message: "You must be logged in to post a review" });
    }
  
    // Validate if review is provided
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
  
    // Find the book by ISBN
    const book = books[isbn];
  
    // Check if the book exists
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has already reviewed this book
    if (book.reviews[username]) {
      // Modify the existing review
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully", review: book.reviews[username] });
    } else {
      // Add a new review
      book.reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully", review: book.reviews[username] });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports = regd_users;