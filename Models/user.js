const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username can not be blank'],
  },
  password: {
    type: String,
    required: [true, 'password can not be blank'],
  },
});

userSchema.statics.findAndValidate = async function (username, password) {
  const findUser = await this.findOne({ username });
  const isValid = await bcrypt.compare(password, findUser.password);
  return isValid ? findUser : false;
};
module.exports = mongoose.model('User', userSchema);
