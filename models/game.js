const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  console_model: {
    type: Schema.Types.ObjectId,
    ref: "Console",
    required: true,
  },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

// Virtual for dynamically generating a URL for each game document based on
// its _id
GameSchema.virtual("url").get(function () {
  return `/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);
