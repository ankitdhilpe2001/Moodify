const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username Required!!!"],
    unique: [true, "Username should be unique"],
  },
  email: {
    type: String,
    required: [true, "Email required!!!"],
    unique: [true, "Email should be unique"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

UserSchema.pre("save", async function () {
  // Hash only when password is newly set/updated.
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


{
  /*
 If the password is changed, it gets hashed before saving.
 If it’s not changed, hashing is skipped and the document is saved as-is.
 */
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
