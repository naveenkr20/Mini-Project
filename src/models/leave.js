const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required: true
    },
    department:{
        type:String,
        required: true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    leaveType:{
        type:String,
        required:true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    replacement:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    addressDuringLeave:{
        type:String,
        required:true
    },
    LTC:{
        type:Boolean,
        required:true
    },
    status: {
        type: String,
        required: true
    },
    takenCharge: {
        type: Boolean,
        default: false
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    },
    approvedByMidadmin: {
        type: Boolean,
        default: false
    },
    recommendedBy:{
        type:String
    },
    comments: {
        type: String
    }
})

const Leave = mongoose.model('request', leaveSchema)

module.exports = Leave