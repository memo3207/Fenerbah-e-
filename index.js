const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const generateRouter = require("./routes/generate");

app.get("/", (req, res) => res.render("generate"));
app.use("/api/generate", generateRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});