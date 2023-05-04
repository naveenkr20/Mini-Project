const cookieParser = require('cookie-parser')
const Admin = require('../models/midadmin')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    
    if(!req.cookies['auth_token'])
        return res.redirect('/')

    const token = req.cookies['auth_token']
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    const user = await Admin.findOne({_id: decode._id, 'tokens.token': token})

    if(!user) {
        return res.redirect('/')
    }

    req.user = user
    req.token = token
    next()
}

module.exports = auth