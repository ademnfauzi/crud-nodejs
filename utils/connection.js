const mongoose = require("mongoose");
const schemaBook = require("../models/userModel");
mongoose.connect("mongodb://127.0.0.1:27017/studyNode");

// // example for create one data
// const data = new schemaBook({
//    name: "Ade Muhammad Nur Fauzi",
//    username: "ademnfauzi",
//    email: "ademnfauzi76@gmail.com",
//    password: "password123",
// });

// // save to collection
// data.save().then((result) => console.log(result));
