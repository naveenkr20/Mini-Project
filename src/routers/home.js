const express = require('express')
const unauth = require('../middlewares/unauth')
const User = require('../models/user')
const Leave = require('../models/leave')

const router = new express.Router()

router.get('/', unauth, async (req, res)=>{

    res.render("home", {home: 1})
})



module.exports = router