const mongoose = require("mongoose");
require("../config/mongodbconn.cjs");

const classRecordSchema = new mongoose.Schema(
  {
    recordId: { type: String, required: true, unique: true },
    classId: { type: String, required: true },
    className: { type: String, default: "" },
    classTime: { type: String, default: "" },
    instructorId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    attendees: { type: [String], default: [] },
    noPackageAttendees: { type: [String], default: [] }
  },
  {
    collection: "classRecords",
    timestamps: true
  }
);

classRecordSchema.index({ classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ClassRecord", classRecordSchema);