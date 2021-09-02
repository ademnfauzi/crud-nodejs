const fs = require("fs");

// create directory data
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
   fs.mkdirSync(dirPath);
}

// create books.json
const path = "./data/books.json";
if (!fs.existsSync(path)) {
   fs.writeFileSync(path, "[]", "utf-8");
}

const loadData = () => {
   // read file
   const readFile = fs.readFileSync("data/books.json", "utf-8");
   // convert from string to object
   const books = JSON.parse(readFile);
   return books;
};

const checkDuplicate = (id) => {
   const books = loadData();
   const filterBook = books.find((book) => book.id === id);
   return filterBook;
};

const overwrite = (value) => {
   fs.writeFileSync("data/books.json", JSON.stringify(value));
};

const addBook = (result) => {
   const books = loadData();
   books.push(result);
   overwrite(books);
};

const findById = (id) => {
   const books = loadData();
   const resultFind = books.find((book) => book.id === id);
   return resultFind;
};

const deleteBook = (id) => {
   const books = loadData();
   const filter = books.filter((book) => book.id !== id);
   console.log(filter);
   overwrite(filter);
};

const updateBook = (value) => {
   const books = loadData();
   const filteredBook = books.filter((book) => book.id != value.id);
   delete value.idOld;
   filteredBook.push(value);
   overwrite(filteredBook);
};

module.exports = {
   loadData,
   checkDuplicate,
   addBook,
   findById,
   deleteBook,
   updateBook,
};
