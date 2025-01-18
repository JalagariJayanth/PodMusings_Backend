const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    img:{
        type:String,
    },
    googleSignIn:{
        type:Boolean,
        required:true,
        default:false,
    },
    favourites:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Podcast",
        default: [],
    },
    otp: { 
        type: String,
        default: null,
    },
    otpExpiration: { 
        type: Date,
        default: null,
    },



},{
    timestamps:true
})
module.exports = mongoose.model('User', UserSchema);