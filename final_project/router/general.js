const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
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

public_users.get("/booksdb", function (req, res) {
  res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  console.log("START - Get list of books");
  axios
    .get("http://localhost:5000/booksdb")
    .then((response) => {
      console.log("END - Get list of books");
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  console.log("START - Get books by ISBN");
  axios
    .get("http://localhost:5000/booksdb")
    .then((response) => {
      const book = response.data[req.params.isbn];
      if (!book) {
        res.status(404).json({ message: "Book not found" });
      } else {
        console.log("END - Get books by ISBN");
        res.status(200).json(book);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching books" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  console.log("START - Get books by author");
  axios
    .get("http://localhost:5000/booksdb")
    .then((response) => {
      const booksByAuthor = Object.values(response.data).filter(
        (book) => book.author === req.params.author
      );
      if (booksByAuthor.length === 0) {
        res.status(404).json({ message: "Books not found" });
      } else {
        console.log("END - Get books by author");
        res.status(200).json(booksByAuthor);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching books" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  console.log("START - Get books by title");
  axios
    .get("http://localhost:5000/booksdb")
    .then((response) => {
      const booksByTitle = Object.values(response.data).filter(
        (book) => book.title === req.params.title
      );
      if (booksByTitle.length === 0) {
        res.status(404).json({ message: "Books not found" });
      } else {
        console.log("END - Get books by title");
        res.status(200).json(booksByTitle);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error fetching books" });
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
