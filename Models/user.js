const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username can not be blank"],
  },
  username: {
    type: String,
    required: [true, "password can not be blank"],
  },
});

module.exports = mongoose.model("User", userSchema);
