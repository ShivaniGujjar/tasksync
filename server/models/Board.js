// server/models/Board.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  background: {
    type: String,
    default: '#ffffff',
  },
  deadline: {
    type: Date,
    default: null,
  },

  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Board', BoardSchema);

