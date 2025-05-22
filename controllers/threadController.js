const Thread = require('../models/Thread');

// Get all threads
exports.getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new thread
exports.createThread = async (req, res) => {
  const thread = new Thread(req.body);
  try {
    const newThread = await thread.save();
    res.status(201).json(newThread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single thread
exports.getThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a thread
exports.addComment = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    
    thread.comments.push(req.body);
    const updatedThread = await thread.save();
    res.status(200).json(updatedThread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a thread
exports.updateThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    
    Object.assign(thread, req.body);
    thread.updatedAt = Date.now();
    const updatedThread = await thread.save();
    res.status(200).json(updatedThread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a thread
exports.deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    
    await thread.remove();
    res.status(200).json({ message: 'Thread deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get threads by category
exports.getThreadsByCategory = async (req, res) => {
  try {
    const threads = await Thread.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a thread
exports.likeThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    
    thread.likes += 1;
    const updatedThread = await thread.save();
    res.status(200).json(updatedThread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 