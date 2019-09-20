const mongoose = require("mongoose");
/**
 * @param videoid
 * @param linkhinh
 */
const VideoSchema = new mongoose.Schema({
    videoid: String,
    imageUrl:String
});

module.exports = mongoose.model("videos", VideoSchema);