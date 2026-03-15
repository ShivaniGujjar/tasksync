// server/models/List.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Card',
    },
  ],

  position: { type: Number, required: true }, 
});

module.exports = mongoose.model('List', ListSchema);

