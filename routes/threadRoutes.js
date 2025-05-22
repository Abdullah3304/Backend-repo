const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');

// Get all threads
router.get('/', threadController.getAllThreads);

// Create a new thread
router.post('/', threadController.createThread);

// Get a single thread
router.get('/:id', threadController.getThread);

// Update a thread
router.put('/:id', threadController.updateThread);

// Delete a thread
router.delete('/:id', threadController.deleteThread);

// Add a comment to a thread
router.post('/:id/comments', threadController.addComment);

// Get threads by category
router.get('/category/:category', threadController.getThreadsByCategory);

// Like a thread
router.post('/:id/like', threadController.likeThread);

module.exports = router; 