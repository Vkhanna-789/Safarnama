const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  travelStoryId: { type: Schema.Types.ObjectId, ref: 'TravelStory', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentText: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
