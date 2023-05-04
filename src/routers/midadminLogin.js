const express = require('express')
const Admin = require('../models/midadmin')
const unauth = require('../middlewares/unauth')

const router = new express.Router()

router.get('/midadminLogin', unauth, (req, res) => {
    res.render('login', {type: "midadmin", error: req.query.error})
})

router.post('/midadminLogin', async (req, res) => {
    try {
        const user = await Admin.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/midadmin/recommend')
    } 
    catch (e) {
        res.redirect('/midadminLogin?error=1')
    }
    
})

module.exports = router