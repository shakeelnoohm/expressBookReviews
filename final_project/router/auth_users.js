const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if the username exists in the 'users' array (or database)
    return users.some(user => user.username === username);  // Return true if username exists, false otherwise
  };
  
  const authenticatedUser = (username, password) => {
    // Check if the username exists and if the password matches
    const user = users.find(user => user.username === username);
    return user && user.password === password;  // Return true if user exists and password matches
  };
  
  // Secret key for JWT token signing
  const SECRET_KEY = "your_secret_key";  // Replace with a more secure key in production
  
  // Login route for registered users
  regd_users.post("customer/login", (req, res) => {
    const { username, password } = req.body;
  
    // Check if both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username exists and if the password is correct
    if (!isValid(username)) {
      return res.status(400).json({ message: "Username not found" });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(400).json({ message: "Incorrect password" });
    }
  
    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });  // Token expires in 1 hour
  
    // Send the token in the response
    return res.status(200).json({
      message: "Login successful",
      token: token
    });
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
