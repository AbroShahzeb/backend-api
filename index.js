require("dotenv").config();

const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.static("public"));

// Use the MongoDB URI from the environment variable
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  // Add other fields as needed
});

const Article = mongoose.model("Article", articleSchema);

app.get("/post-article", async (req, res) => {
  const article = new Article({
    title: "Article title",
    content: "Article content",
  });
  await article.save();
  res.json({ message: "Article inserted" });
});

app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Unable to fetch articles" });
  }
});

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public/images/icon-thank-you.svg"));
});

app.get("/user", (req, res) => {
  res.json({ message: "User page" });
});

app.listen(process.env.PORT || 3000);
