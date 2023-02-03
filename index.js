const express = require("express");
const app = express();
const User = require("./Models/user");

app.set("view engine ", "ejs");
app.set("views", "views");
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secret", (req, res) => {
  res.send("THIS IS A SECRET! YOU CAN NOT SEE ME UNLESS YOU ARE LOGGED IN ");
});

app.listen(3000, () => {
  console.log("SERVING YOUR APP!");
});
