const express = require("express");
const router = express.Router();

const {
    getSharedPost
} = require("../controllers/userController");

router.get("/:id", getSharedPost);

module.exports = router;