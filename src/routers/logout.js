const express = require('express')
const auth = require('../middlewares/auth')
const adminAuth = require('../middlewares/adminAuth')
const midadminAuth = require('../middlewares/midadminAuth')

const router = new express.Router()

router.get('/logout', auth, async (req, res) => {
    const user = req.user
    const token = req.token
    
    try {
        user.tokens = user.tokens.filter((t) => t.token!==token)
        await user.save()
    } catch (e) {
        res.redirect('/user')
    }

    res.redirect('/')
})

router.get('/adminLogout', adminAuth, async (req, res) => {
    const user = req.user
    const token = req.token
    
    try {
        user.tokens = user.tokens.filter((t) => t.token!==token)
        await user.save()
    } catch (e) {
        res.redirect('/user')
    }

    res.redirect('/')
})

router.get('/logoutAll', auth, async (req, res) => {
    const user = req.user
    
    try {
        user.tokens = []
        await user.save()
    } catch (e) {
        res.redirect('/user')
    }

    res.redirect('/')
})

router.get('/adminLogoutAll', adminAuth, async (req, res) => {
    const user = req.user
    
    try {
        user.tokens = []
        await user.save()
    } catch (e) {
        res.redirect('/user')
    }

    res.redirect('/')
})

router.get('/midadminLogout', midadminAuth, async (req, res) => {
    const user = req.user
    const token = req.token
    
    try {
        user.tokens = user.tokens.filter((t) => t.token!==token)
        await user.save()
    } catch (e) {
        res.redirect('/user')
    }

    res.redirect('/')
})

module.exports = router