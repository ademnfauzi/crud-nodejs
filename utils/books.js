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

module.exports = {
   loadData,
   checkDuplicate,
   addBook,
};
