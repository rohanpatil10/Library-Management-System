const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // ✅ ADD THIS
require("dotenv").config();

const users = require("./routes/user.js");
const books = require("./routes/books.js");
const admin = require("./routes/admin.js");
const librarian = require("./routes/librarian.js");
const home = require("./routes/home.js");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

/* ---------- STATIC FILES (THIS FIXES YOUR ISSUE) ---------- */
app.use(
  "/book-covers",
  express.static(path.join(__dirname, "public/book-covers"))
);

/* ---------- ROUTES ---------- */
app.use("/users", users);
app.use("/books", books);
app.use("/admin", admin);
app.use("/librarian", librarian);
app.use("/home", home);

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ---------- DATABASE + SERVER ---------- */
const PORT = process.env.PORT || 4001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Loaded Mongo URI =>", process.env.MONGO_URI);

    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
