const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getCurrentUser,
    getUserPosts
} = require("../controllers/userController");

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);

router.get(
    "/:id/posts",
    getUserPosts
);

module.exports = router;