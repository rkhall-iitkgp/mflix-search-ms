const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    validate:{
      validator: function(email) {
        // Regular expression to validate email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters long'] },
  dob: { type: Date, required: false },
  phone: { type: Number, required: false },
  gender: { type: String, required: false },

  subscriptionTier: {
    tier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tier",
      required: false,
    },
    bill: { type: mongoose.Schema.Types.ObjectId, ref: "payments" },
  },

  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "payments" }],
  moviesWatched: [
    {
      movie: { type: mongoose.Schema.Types.ObjectId, ref: "movies" },
      durationWatched: { type: Number },
    },
  ],

  watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "movies" }],
});

module.exports = userSchema;
