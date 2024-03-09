const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConsoleSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
});

// Virtual for dynamically generating a URL for each console document based on
// its _id
ConsoleSchema.virtual("url").get(function () {
  return `/console/${this._id}`;
});

module.exports = mongoose.model("Console", ConsoleSchema);
