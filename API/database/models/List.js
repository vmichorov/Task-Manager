const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 1, trim: true },
  _userId: { type: mongoose.Types.ObjectId, required: true },
});

const List = mongoose.model("List", schema);

module.exports = { List };
