const express = new require('express')
const User = require('../models/user')
const unauth = require('../middlewares/unauth')

const router = new express.Router()

router.get('/forgotPassword', unauth, (req, res) => {
    res.render('forgotPassword', {type: "user", error: req.query.error})
})

router.post('/forgotPassword', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/')
    } 
    catch (e) {
        res.redirect('/login?error=1')
    }
    
})

module.exports = router