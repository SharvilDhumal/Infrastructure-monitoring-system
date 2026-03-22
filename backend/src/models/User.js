const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
      index: true, // Index for faster lookups
    },
    // Note: Email uniqueness is enforced globally. We do not support account linking.
    // If a user exists with provider 'local', they cannot sign in with 'google' and vice versa.
    googleId: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "pothole_admin", "bridge_admin", "streetlight_admin", "water_admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
