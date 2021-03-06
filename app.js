// call modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("./utils/connection");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverrride = require("method-override");
const {
   loadData,
   checkDuplicate,
   addBook,
   findById,
   deleteBook,
   updateBook,
} = require("./utils/books");
const schemaBook = require("./models/userModel");
const { findOne } = require("./models/userModel");
const { error } = require("console");
const { check, body, validationResult, Result } = require("express-validator");

// setup express
const app = express();
const port = 3000;

// setup override method
app.use(methodOverrride("_method"));

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
   console.log(`You can klik at => http://localhost:${port}`);
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
      msg: req.flash("msg"),
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
         };
         res.render("add-book", {
            layout: "../layouts/main",
            data,
            errors: errors.array(),
         });
      } else {
         addBook(req.body);
         req.flash("msg", "Success for add book");
         res.redirect("/books");
      }
   }
);

app.get("/bookDelete/:id", (req, res) => {
   // res.send(req.params.id);
   const book = findById(req.params.id);
   if (!book) {
      res.status(404);
      res.send("<h1>File Not Found</h1>");
   } else {
      // res.send(book);
      deleteBook(req.params.id);
      // res.send(deleteBook);
      req.flash("msg", "Success for deleted book");
      res.redirect("/books");
   }
});

app.get("/bookEdit/:id", (req, res) => {
   const book = findById(req.params.id);
   // res.send(book);
   if (!book) {
      res.status(404);
      res.send("<h1>File Not Found</h1>");
   } else {
      const data = {
         title: "Edit Books Page",
         nav: "Books",
         value: book,
      };
      res.render("edit-book", {
         layout: "../layouts/main",
         data,
      });
   }
});

app.post(
   "/bookUpdate",
   [
      check("id", "Id length must be at least 3 and max 5")
         .isNumeric()
         .isLength({ max: 5, min: 3 }),
   ],
   (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         const data = {
            title: "Edit Books Page",
            nav: "Books",
         };
         res.render("edit-book", {
            layout: "../layouts/main",
            data,
            errors: errors.array(),
         });
      } else {
         // res.send(req.body);
         updateBook(req.body);
         req.flash("msg", "Success for edit book");
         res.redirect("/books");
      }
   }
);

// mongo db

app.get("/users", async (req, res) => {
   // res.send("hello world");
   const users = await schemaBook.find();
   // res.send(users);
   const data = {
      title: "User Page",
      nav: "User",
      users,
   };
   res.render("user", {
      layout: "../layouts/main",
      data,
      msg: req.flash("msg"),
   });
});

app.get("/user/add", (req, res) => {
   const data = {
      title: "Add User Page",
      nav: "User",
   };
   res.render("add-user", {
      layout: "../layouts/main",
      data,
      msg: req.flash("msg"),
   });
});

app.post(
   "/users",
   [
      body("username").custom(async (value) => {
         const duplicate = await schemaBook.findOne({ username: value });
         if (duplicate) {
            throw new Error("Username has already use");
         }
         return true;
      }),
      check("email", "You email is invalid").isEmail(),
      check("password", "Id length must be at least 3").isLength({
         min: 3,
      }),
   ],
   (req, res) => {
      // res.send(req.body);
      const errors = validationResult(req);
      // res.send(errors);
      if (!errors.isEmpty()) {
         const data = {
            title: "Add User Page",
            nav: "User",
         };
         res.render("add-user", {
            layout: "../layouts/main",
            data,
            errors: errors.array(),
         });
      } else {
         schemaBook.insertMany(req.body, (error, result) => {
            req.flash("msg", "User Data has been add");
            res.redirect("/users");
         });
      }
   }
);

app.delete("/users", (req, res) => {
   // res.send(req.body);
   schemaBook.deleteOne({ _id: req.body.id }).then((result) => {
      req.flash("msg", "User Data has been deleted");
      res.redirect("/users");
   });
});

app.get("/userEdit/:id", async (req, res) => {
   const loadData = await schemaBook.findOne(req.params._id);
   // res.send(loadData);
   const data = {
      title: "Edit User Page",
      nav: "User",
      loadData,
   };
   res.render("edit-user", {
      layout: "../layouts/main",
      data,
      msg: req.flash("msg"),
   });
});

app.put(
   "/users",
   [
      body("username").custom(async (value, { req }) => {
         const duplicate = await schemaBook.findOne({ username: value });
         if (value !== req.body.usernameOld && duplicate) {
            throw new Error("Username has already use");
         }
         return true;
      }),
      check("email", "You email is invalid").isEmail(),
      check("password", "Id length must be at least 3").isLength({
         min: 3,
      }),
   ],
   (req, res) => {
      // res.send(req.body);
      const errors = validationResult(req);
      // res.send(errors);
      if (!errors.isEmpty()) {
         const data = {
            title: "Edit User Page",
            nav: "User",
            loadData: req.body,
         };
         res.render("edit-user", {
            layout: "../layouts/main",
            data,
            errors: errors.array(),
         });
      } else {
         schemaBook
            .updateOne(
               { _id: req.body._id },
               {
                  $set: {
                     nama: req.body.nama,
                     username: req.body.username,
                     email: req.body.email,
                     password: req.body.password,
                  },
               }
            )
            .then((result) => {
               req.flash("msg", "User Data has been updated");
               res.redirect("/users");
            });
      }
   }
);

// midlleware if the route not found
app.use((req, res) => {
   res.status(404);
   res.send("<h1>File Not Found</h1>");
});
