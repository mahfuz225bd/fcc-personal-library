const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");

const assert = chai.assert;
chai.use(chaiHttp);

let bookId;

suite("Functional Tests", function () {
  suite("POST /api/books", function () {
    test("Create book with title", (done) => {
      chai
        .request(server)
        .post("/api/books")
        .send({ title: "Test Book" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, "_id");
          assert.equal(res.body.title, "Test Book");
          bookId = res.body._id;
          done();
        });
    });

    test("Create book without title", (done) => {
      chai
        .request(server)
        .post("/api/books")
        .send({})
        .end((err, res) => {
          assert.equal(res.text, "missing required field title");
          done();
        });
    });
  });

  suite("GET /api/books", function () {
    test("View all books", (done) => {
      chai
        .request(server)
        .get("/api/books")
        .end((err, res) => {
          assert.isArray(res.body);
          assert.property(res.body[0], "commentcount");
          done();
        });
    });
  });

  suite("GET /api/books/:id", function () {
    test("Get book with valid id", (done) => {
      chai
        .request(server)
        .get(`/api/books/${bookId}`)
        .end((err, res) => {
          assert.equal(res.body.title, "Test Book");
          assert.isArray(res.body.comments);
          done();
        });
    });

    test("Get book with invalid id", (done) => {
      chai
        .request(server)
        .get("/api/books/invalidid")
        .end((err, res) => {
          assert.equal(res.text, "no book exists");
          done();
        });
    });
  });

  suite("POST /api/books/:id", function () {
    test("Add comment", (done) => {
      chai
        .request(server)
        .post(`/api/books/${bookId}`)
        .send({ comment: "Great book" })
        .end((err, res) => {
          assert.include(res.body.comments, "Great book");
          done();
        });
    });

    test("Add comment without comment", (done) => {
      chai
        .request(server)
        .post(`/api/books/${bookId}`)
        .send({})
        .end((err, res) => {
          assert.equal(res.text, "missing required field comment");
          done();
        });
    });
  });

  suite("DELETE /api/books/:id", function () {
    test("Delete book", (done) => {
      chai
        .request(server)
        .delete(`/api/books/${bookId}`)
        .end((err, res) => {
          assert.equal(res.text, "delete successful");
          done();
        });
    });

    test("Delete invalid book", (done) => {
      chai
        .request(server)
        .delete("/api/books/invalidid")
        .end((err, res) => {
          assert.equal(res.text, "no book exists");
          done();
        });
    });
  });

  suite("DELETE /api/books", function () {
    test("Delete all books", (done) => {
      chai
        .request(server)
        .delete("/api/books")
        .end((err, res) => {
          assert.equal(res.text, "complete delete successful");
          done();
        });
    });
  });
});
