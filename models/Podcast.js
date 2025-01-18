const mongoose = require("mongoose");

const PodCastSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    type: {
        type: String,
        enum: ['audio', 'video'],
        default: "audio",
    },
    category: {
        type: String,
        default: "podcast",
    },
    views:{
        type: Number,
        default: 0,
    },
    episodes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Episode",
    },
    public_id: { type: String },

},{
    
        timestamps: true,
    
})

module.exports = mongoose.model('Podcast', PodCastSchema);