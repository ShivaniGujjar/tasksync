const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: "List",
    required: true,
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  labels: [
    {
      _id: false,
      text: String,
      color: String,
    },
  ],
  checklist: [
    {
      _id: false,
      text: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});
module.exports = mongoose.model("Card", CardSchema);


