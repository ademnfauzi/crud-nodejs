// call modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { loadData, checkDuplicate, addBook } = require("./utils/books");
const { check, body, validationResult } = require("express-validator");

// setup express
const app = express();
const port = 3000;

// setup ejs
app.set("view engine", "ejs");
app.use(expressLayouts);

// middleware encode
app.use(express.urlencoded({ extended: true }));

// config flash
app.use(cookieParser("secret"));
app.use(
   session({
      cookie: { maxAge: 6000 },
      secret: "secret",
      resave: true,
      saveUninitialized: true,
   })
);
app.use(flash());

// on the port
app.listen(port, () => {
   console.log(`You can klik at http://localhost:${port}`);
});

app.get("/", (req, res) => {
   //    res.send("Ini halaman home");
   const data = {
      title: "Home Page",
      nav: "Home",
   };
   res.render("index", {
      layout: "../layouts/main",
      data,
   });
});

app.get("/books", (req, res) => {
   const data = {
      title: "Books Page",
      nav: "Books",
      load: loadData(),
   };
   res.render("books", {
      layout: "../layouts/main",
      data,
   });
});

app.get("/addBook", (req, res) => {
   const data = {
      title: "Add Books Page",
      nav: "Books",
   };
   res.render("add-book", {
      layout: "../layouts/main",
      data,
   });
});

app.post(
   "/book",
   [
      body("id").custom((value) => {
         const duplicate = checkDuplicate(value);
         if (duplicate) {
            throw new Error("Id has already use");
         }
         return true;
      }),
      check("id", "Id length must be at least 3 and max 5")
         .isNumeric()
         .isLength({ max: 5, min: 3 }),
   ],
   (req, res) => {
      //   res.send(req.body);
      const errors = validationResult(req);
      //   res.send(errors);
      if (!errors.isEmpty()) {
         const data = {
            title: "Add Books Page",
            nav: "Books",
            error: errors.array(),
         };
         res.render("add-book", {
            layout: "../layouts/main",
            data,
         });
      } else {
         addBook(req.body);
         req.flash("msg", "Success for add book");
         res.redirect("/books");
      }
   }
);

// midlleware if the route not found
app.use((req, res) => {
   res.status(404);
   res.send("<h1>File Not Found</h1>");
});
