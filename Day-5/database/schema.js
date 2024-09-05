const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    password: {type : String, requred: true},
    username: {type : String, requred: true, unique: true},
});

module.exports = {
    userSchema
};


