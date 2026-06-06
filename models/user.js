const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
    type: String,
    required: true,
    unique: true,
    validate: {
        validator: validator.isEmail,
        message: "Please enter a valid email"
    }
    },

    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("User",UserSchema);