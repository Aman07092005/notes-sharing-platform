const Post = require("../models/Post");
const User = require("../models/user");

exports.getSharedPost = async (req, res) => {
try {

    const post = await Post.findById(req.params.id)
        .populate("owner", "username");

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    res.status(200).json(post);

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.getCurrentUser = async (req, res) => {
try {

    const user = await User.findById(
        req.user.userId
    ).select("-password");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.status(200).json(user);

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      owner: req.params.id,
    })
      .populate(
        "owner",
        "username avatar"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};