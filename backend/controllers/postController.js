const Post = require("../models/Post");

exports.getPosts = async (req, res) => {
try {
    const filter = {};

    const allowedTypes = ["pdf", "youtube", "link"];

    if ( req.query.type && !allowedTypes.includes(req.query.type)){
        return res.status(400).json({
            message: "Invalid resource type"
        });
    }

    if (req.query.type) {
        filter.resourceType = req.query.type;
    }

    const posts = await Post.find(filter)
        .populate("owner", "username email")
        .sort({ createdAt: -1 });

    res.status(200).json(posts);

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.getPostById = async (req, res) => {
try {
    const post = await Post.findById(req.params.id)
        .populate("owner", "username email")

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

exports.createPost = async (req, res) => {
try {
    const {
        title,
        description,
        resourceType,
        url
    } = req.body;

    if (!title || !resourceType || !url) {
        return res.status(400).json({
            message: "All fields are required"
    });
    }

    const allowedTypes = ["pdf", "youtube", "link"];

    if (!allowedTypes.includes(resourceType)){
        return res.status(400).json({
            message: "Invalid resource type"
        });
    }

    const post = await Post.create({
        title,
        description,
        resourceType,
        url,
        owner: req.user.userId
    });

    res.status(201).json({
        message: "Post created successfully",
        post
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.updatePost = async (req, res) => {
try {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.owner.toString() !== req.user.userId) {
        return res.status(403).json({
            message: "You are not the owner of this post"
        });
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        message: "Post updated successfully",
        post: updatedPost
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};

exports.deletePost = async (req, res) => {
try {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    if (post.owner.toString() !== req.user.userId) {
        return res.status(403).json({
            message: "You are not the owner of this post"
        });
    }

    await post.deleteOne();

    res.status(200).json({
        message: "Post deleted successfully"
    });

} catch (error) {
    res.status(500).json({
        message: error.message
    });
}
};