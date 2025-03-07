const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxLength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 200,
      unique: true,
    },
    online: { type: Boolean, default: false },
    password: { type: String, required: true, minlength: 3, maxLength: 1024 },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
