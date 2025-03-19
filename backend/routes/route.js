const express = require('express');
const Posts = require('../models/model');

const router = express.Router();

router.post('/post/save', async (req, res) => {
    try {
        let newPost = new Posts(req.body);
        await newPost.save();
        res.status(200).json({
            success: "Post saved successfully"
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

router.get('/posts', async (req, res) => {
    try {
        const posts = await Posts.find();  // Fetch data from MongoDB
        res.status(200).json({
            success: true,
            existingPosts: posts  // Correct structure
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


router.put('/posts/update/:id', async (req, res) => {
    try {
        await Posts.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });
        res.status(200).json({
            success: "Updated Successfully"
        });
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});

// Delete a post by ID
router.delete('/posts/delete/:id', async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Issue not found" });
        }
        res.status(200).json({ message: "Issue deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Fetch a single post by ID
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;

 