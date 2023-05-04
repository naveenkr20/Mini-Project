const express = require('express')
const Admin = require('../models/admin')
const unauth = require('../middlewares/unauth')

const router = new express.Router()

router.get('/adminLogin', unauth, (req, res) => {
    res.render('login', {type: "admin", error: req.query.error})
})

router.post('/adminLogin', async (req, res) => {
    try {
        const user = await Admin.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/')
    } 
    catch (e) {
        res.redirect('/adminLogin?error=1')
    }
    
})
//Editor naveen


module.exports = router