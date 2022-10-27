const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const notesRoutes = require("./routes/notes");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(notesRoutes);
app.use(categoryRoutes);
app.use("/auth", authRoutes);

// error handler middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("Insert link to MongoDB")
  .then((result) => {
    app.listen(8080);
    console.log("Connected");
  })
  .catch((err) => console.log(err));
