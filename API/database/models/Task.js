const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  content: { type: String, required: true, minLength: 1, trim: true },
  _listId: { type: mongoose.Types.ObjectId, required: true },
});

const Task = mongoose.model("Task", schema);

module.exports = { Task };
