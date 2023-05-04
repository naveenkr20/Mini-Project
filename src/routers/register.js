const express = require('express')
const User = require('../models/user.js')
const midadmin = require('../models/midadmin.js')
const adminAuth = require('../middlewares/adminAuth')

const router = new express.Router()

router.get('/register', adminAuth, (req, res) => {
    res.render('register', {error: req.query.error})
})

router.post('/register', async (req, res) => {
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        isOnLeave: false,
        password: req.body.password,
        gender: req.body.gender,
        designation: req.body.designation,
        department: req.body.department
    })

    try {
        const token = await user.generateAuthToken()
        res.redirect('/register')
    }
    catch (e) {
        res.redirect('/register?error=1')
    }
})

router.get('/midadminRegister', adminAuth, (req, res) => {
    res.render('midadminRegister', {error: req.query.error, auth: req.query.auth})
})

router.post('/midadminRegister', async (req, res) => {
    const user = new midadmin({
        email: req.body.email,
        password: req.body.password,
        designation: req.body.designation,
        department: req.body.department
    })

    try {
        const token = await user.generateAuthToken()
        res.redirect('/midadminRegister')
    }
    catch (e) {
        res.redirect('/midadminRegister?error=1')
    }
})

//Editor naveen 


  

module.exports = router