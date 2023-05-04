const express = require('express')
const auth = require('../middlewares/auth')
const User = require('../models/user')
const Leave = require('../models/leave')

const router = new express.Router()

router.get('/leaveForm',auth,(req,res)=>{

    res.render('leaveForm',{user:req.user})
})

router.post('/leaveForm',auth, async (req, res)=>{
    
    try {

        var replacementUser = await User.findOne({email: req.body.replacement})
        if (!replacementUser) {
            throw new Error("Replacement user not found")
        }

        var LTCValue = false
        if (req.body.LTC) {
            LTCValue = true
        }

        var endTimestamp = new Date(req.body.endTime).getTime()
        endTimestamp += (60 * 1000)
        const endTime = new Date(endTimestamp)

        const leave = new Leave({
            userID: req.user._id,
            name: req.user.name,
            email: req.user.email,
            mobile: req.user.mobile,
            designation: req.user.designation,
            department: req.user.department,
            startTime: req.body.startTime,
            endTime: endTime,
            leaveType: req.body.leaveType,
            reason: req.body.reason,
            replacement: replacementUser._id,
            addressDuringLeave: req.body.addressDuringLeave,
            LTC: LTCValue,
            status: "pending",
            comments: ""
        }) 

        await leave.save()
        
    } catch (e) {
        console.log(e)
    }
    
    res.redirect('/user') 
})

module.exports = router