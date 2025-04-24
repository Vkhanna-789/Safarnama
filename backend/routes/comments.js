const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const TravelStory = require('../models/TravelStory');

// POST /stories/:id/comments - Add a comment to a specific story
router.post('/stories/:id/comments', async (req, res) => {
  try {
    const { id } = req.params; // TravelStory ID
    const { commentText, userId } = req.body;

    // Create a new comment
    const newComment = new Comment({
      travelStoryId: id,
      userId,
      commentText
    });

    // Save the comment to the database
    const savedComment = await newComment.save();

    // Add the comment reference to the TravelStory's comments array
    await TravelStory.findByIdAndUpdate(id, { $push: { comments: savedComment._id } });

    res.status(201).json({ message: 'Comment added successfully', comment: savedComment });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
});

// GET /stories/:id/comments - Retrieve all comments for a specific story
router.get('/stories/:id/comments', async (req, res) => {
  try {
    const { id } = req.params; // TravelStory ID

    // Find the travel story and populate its comments
    const storyWithComments = await TravelStory.findById(id).populate({
      path: 'comments',
      populate: { path: 'userId', select: 'username' } // Populate the userId with username
    });

    if (!storyWithComments) {
      return res.status(404).json({ message: 'Travel story not found' });
    }

    res.status(200).json({ comments: storyWithComments.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving comments', error });
  }
});

module.exports = router;
