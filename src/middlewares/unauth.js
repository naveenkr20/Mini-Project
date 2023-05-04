const cookieParser = require('cookie-parser')
const User = require('../models/user')
const Admin = require('../models/admin')
const Midadmin = require('../models/midadmin')
const jwt = require('jsonwebtoken')

const unauth = async (req, res, next) => {
    if(!req.cookies['auth_token'])
        return next()

    const token = req.cookies['auth_token']
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({_id: decode._id, 'tokens.token': token})
    
    if(user) {
        return res.redirect('/user')
    }

    const admin = await Admin.findOne({_id: decode._id, 'tokens.token': token})

    if(admin) {
        return res.redirect('/admin')
    }

    const midadmin = await Midadmin.findOne({_id: decode._id, 'tokens.token': token})

    if(midadmin) {
        return res.redirect('/midadmin')
    }

    next()
}

module.exports = unauth