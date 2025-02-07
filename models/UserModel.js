const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String, unique: true}
});

module.exports = mongoose.model('User', userSchema);