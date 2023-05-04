const express = require('express')
const auth = require('../middlewares/midadminAuth')
const authARDR = require('../middlewares/authARDR')
const Leave = require('../models/leave')
const User = require('../models/user')
const midAdmin = require('../models/midadmin')
const router = new express.Router()
// const moment = require('moment')

router.get('/midadmin', auth, (req, res) => {
    res.redirect('/midadmin/recommend')
})

router.get('/midadmin/leave', authARDR, async (req, res) => {
    let leave

    leave = await Leave.find({status: "recommended", takenCharge: true, approvedByMidadmin: false})
    
    var inCharge = {}
    for (var e of leave) {
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

    res.render("adminLeaves.ejs", {leaves: leave, inCharge: inCharge, type: 'midadmin', position: req.user.position})
})

router.post('/midadmin/leave', authARDR, async(req, res) => {

    try {    
        var leave = await Leave.findOne({_id: req.body._id})

        var startTimeStamp = leave.startTime.getTime()
        var endTimeStamp = leave.endTime.getTime()
        var daysCount = parseInt((endTimeStamp - startTimeStamp) / (1000 * 60 * 60 * 24)) + 1

        if (req.body.status == 'Approve') {

            leave.approvedByMidadmin = true

            if (leave.approvedByAdmin == true) {
                leave.status = 'approved'

                const user = await User.findOne({_id: leave.userID})

                if (leave.leaveType === 'CL') {
                    user.leavesLeft.cl -= daysCount
                }
                if (leave.leaveType === 'RH') {
                    user.leavesLeft.rh -= daysCount
                }
                if (leave.leaveType === 'EL') {
                    user.leavesLeft.el -= daysCount
                }
                if (leave.leaveType === 'HPL') {
                    user.leavesLeft.hpl -= daysCount
                }
                if (leave.leaveType === 'Vacation') {
                    user.leavesLeft.el -= daysCount / 2.0
                }
                
                await user.save()
            }

        }
        else {
            leave.status = 'rejected'
        }
        
        await leave.save()
    }
    catch (e) {
        console.log(e)
    }

    res.redirect('/midadmin/leave')
})

router.get('/midadmin/recommend', auth, async (req, res) => {
    let leave

    if(req.user.position=='DEAN' || req.user.position=='DR') {
        leave = await Leave.find({status:"pending"}).sort({startTime:'asc'})
    }
    else if(req.user.position=='HOD') {
        leave = await Leave.find({status:"pending", department:req.user.department}).sort({startTime:'asc'})
    }
    else {
        leave = await Leave.find({status:"pending", department:"NF"}).sort({startTime:'asc'})
    }

    var inCharge = {}
    for (var e of leave) {
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

    res.render("midadminLeaves.ejs", {leaves: leave, inCharge: inCharge, position: req.user.position})
})

router.post('/midadmin/recommend', auth, async(req, res) => {

    try {    
        var leave = await Leave.findOne({_id: req.body._id})

        if (req.body.status == 'Recommend') {
            leave.status = 'recommended'
            leave.recommendedBy = req.user.position
            if (req.user.position == 'HOD') {
                leave.recommendedBy = 'HOD ' + req.user.department
            }
        }
        else {
            leave.status = 'rejected'
        }

        await leave.save()
    } 
    catch (e) {
        console.log(e)
    }

    res.redirect('/midadmin/leave')
})

module.exports = router

