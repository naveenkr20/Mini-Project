const express = require('express')
const auth = require('../middlewares/auth')
const User = require('../models/user')
const Leave = require('../models/leave')

const router = new express.Router()

router.get('/user', auth, async (req, res)=>{

    const user = req.user
    const leaves = await Leave.find({userID: user._id, status: {$in: ['pending', 'recommended']}})

    var inCharge = {}
    for (var e of leaves) {
        const replacement = await User.findOne({_id: e.replacement})
        if (replacement) {
            inCharge[e._id] = {
                name: replacement.name,
                startDate: e.startTime.toUTCString().slice(5, 16),
                endDate: e.endTime.toUTCString().slice(5, 16)
            }
        }else {
            inCharge[e._id] = {
                name: "Not assigned",
                startDate: e.startTime.toUTCString().slice(5, 16),
                endDate: e.endTime.toUTCString().slice(5, 16)
            }
        }

    }

    res.render("user", {user: user, leaves: leaves, inCharge: inCharge})
})

router.post('/user', auth, async (req, res)=>{

    await Leave.deleteOne({_id: req.body._id})
    res.redirect('/user')
})

router.get('/user/history', auth, async (req, res)=>{

    const user = req.user
    const leaves = await Leave.find({userID: user._id, status: {$in: ['approved', 'rejected']}})

    var inCharge = {}
    for (var e of leaves) {
        const replacement = await User.findOne({_id: e.replacement})
        if (replacement) {
            inCharge[e._id] = {
                name: replacement.name,
                startDate: e.startTime.toUTCString().slice(5, 16),
                endDate: e.endTime.toUTCString().slice(5, 16)
            }
        }else {
            inCharge[e._id] = {
                name: "Not assigned",
                startDate: e.startTime.toUTCString().slice(5, 16),
                endDate: e.endTime.toUTCString().slice(5, 16)
            }
        }

    }

    res.render("userHistory", {leaves: leaves, inCharge: inCharge})
})

router.get('/user/inCharge', auth, async (req, res) => {

    const user = req.user

    let leave
    leave = await Leave.find({status: {$in: ['pending', 'recommended']}, replacement: user._id, takenCharge: false})
    
    var dates = {}
    for (var e of leave) {
        dates[e._id] = {
                            startDate: e.startTime.toUTCString().slice(5, 16),
                            endDate: e.endTime.toUTCString().slice(5, 16)
                        }
    }

    res.render("userInCharge.ejs", {leaves: leave, dates: dates})
})

router.post('/user/inCharge', auth, async(req, res) => {

    try {    
        var leave = await Leave.findOne({_id: req.body._id})

        if (req.body.status == 'Yes') {
            leave.takenCharge = true
        }
        else {
            leave.status = 'rejected'
        }

        await leave.save()
    } 
    catch (e) {
        console.log(e)
    }

    res.redirect('/user/inCharge')
})

module.exports = router