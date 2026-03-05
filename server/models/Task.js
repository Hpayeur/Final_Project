const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dogBreed: {
    type: String,
    required: false,
  },

  age: {
    type: Number,
    required: false,
  },

  task: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Task", TaskSchema);
