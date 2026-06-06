const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

// Public Route
router.get("/", getPosts);

// Protected Routes
router.get("/:id", authMiddleware, getPostById);

router.post("/", authMiddleware, createPost);

router.put("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;