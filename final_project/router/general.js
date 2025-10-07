const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  console.log("START - User registration");
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  if (isValid(username))
    return res.status(409).json({ message: "Username already exists." });

  users.push({ username, password });
  console.log("END - User registration");
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  console.log("START - Get list of books");
  new Promise((resolve, reject) => {
    if (!books || Object.keys(books).length === 0)
      reject({ status: 404, message: "No books available" });
    else resolve(books);
  })
    .then((result) => {
      console.log("END - Get list of books");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  console.log("START - Get books by ISBN");
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (!book) {
      reject({ status: 404, message: "Book not found" });
    } else {
      resolve(book);
    }
  })
    .then((result) => {
      console.log("END - Get books by ISBN");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  console.log("START - Get books by author");
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(
      (book) => book.author === req.params.author
    );
    if (booksByAuthor.length === 0) {
      reject({ status: 404, message: "Books not found" });
    } else {
      resolve(booksByAuthor);
    }
  })
    .then((result) => {
      console.log("END - Get books by author");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  console.log("START - Get books by title");
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(
      (book) => book.title === req.params.title
    );
    if (booksByTitle.length === 0) {
      reject({ status: 404, message: "Books not found" });
    } else {
      resolve(booksByTitle);
    }
  })
    .then((result) => {
      console.log("END - Get books by title");
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(err.status).json({ message: err.message });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  console.log("START - Get book reviews");
  const reviews = books[req.params.isbn].reviews;
  if (!reviews || Object.keys(reviews).length === 0)
    return res.status(404).json({ message: "Book reviews not found" });
  console.log("END - Get book reviews");
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
