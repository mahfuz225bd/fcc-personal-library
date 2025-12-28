/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
});

const Book = mongoose.model("Book", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({});
      res.json(
        books.map((book) => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        }))
      );
    })

    .post(async (req, res) => {
      let title = req.body.title;

      if (!title) {
        return res.send("missing required field title");
      }

      //response will contain new book object including atleast _id and title
      const newBook = new Book({ title: title, comments: [] });
      const savedBook = await newBook.save();

      res.json({ _id: savedBook._id, title: savedBook.title });
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany({});
      res.send("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      try {
        let bookid = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        const book = await Book.findById(bookid);

        if (!book) {
          return res.send("no book exists");
        }

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (error) {
        return res.send("no book exists");
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) return res.send("missing required field comment");

      try {
        const book = await Book.findById(bookid);

        book.comments.push(comment);
        await book.save();

        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (error) {
        res.send("no book exists");
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      try {
        const deleted = await Book.findByIdAndDelete(bookid);

        if (!deleted) return res.send("no book exists");

        res.send("delete successful");
      } catch (error) {
        res.send("no book exists");
      }
    });
};
