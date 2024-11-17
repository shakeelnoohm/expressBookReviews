const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const regd_users = require('./router/auth_users');
const books = require('./router/booksdb.js');

const app = express();

// Secret key from environment variables or fallback to a default key
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

app.use(express.json());

// Session middleware for managing JWT tokens
app.use("/customer", session({ 
    secret: SECRET_KEY, 
    resave: true, 
    saveUninitialized: true, 
    cookie: { maxAge: 3600000 } // Cookie expiry (1 hour)
}));

// Token verification middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);  // Verify using the same secret key
        req.user = decoded; // Attach decoded user info to the request
        next();  // Proceed to the next middleware/route handler
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
});

const PORT = 5000;

app.use("/customer", regd_users);  // Use routes from auth_users.js for handling login
app.use("/", genl_routes);  // Use general routes (e.g., book listing)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
