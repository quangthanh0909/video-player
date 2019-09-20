const mongoose = require("mongoose");

const cap2Schema = new mongoose.Schema({
    name: String,
    mangvideos: [{type:mongoose.Schema.Types.ObjectId}]
});

module.exports = mongoose.model("Cap2", cap2Schema);