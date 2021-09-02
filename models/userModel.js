const mongoose = require("mongoose");

// create schema
const schemaBook = mongoose.model("user", {
   name: {
      type: String,
      required: true,
   },
   username: {
      type: String,
      required: true,
   },
   email: {
      type: String,
   },
   password: {
      type: String,
      required: true,
   },
});

module.exports = schemaBook;
