const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum:["Male","Female","Other"],
        default:null
    },
    dateOfBirth: {
        type: Date,
        default:null
    },
    about: {
        type: String,
        default:null,
        trim: true,
    },
    contactNumber: {
        type: String,
        default:null,
        trim: true,
    },
    image: {
        type:String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
