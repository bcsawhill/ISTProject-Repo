const mongoose = require("mongoose");

const waiverSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    agreed: {
      type: Boolean,
      required: true,
      default: true
    },
    signedAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    collection: "waiver"
  }
);

module.exports = mongoose.model("Waiver", waiverSchema);
