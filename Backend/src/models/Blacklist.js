const mongoose = require("mongoose");

const BlacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token required for blacklisting"],
        unique:[true]
    }
},{timestamps:true})

const Blacklist = mongoose.model("Blacklist",BlacklistSchema);

module.exports = Blacklist;