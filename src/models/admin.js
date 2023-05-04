const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        validate(x) {
            if(!validator.isEmail(x)) {
                throw new Error("Email is not valid!")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(x) {
            if(!validator.isStrongPassword(x)) {
                throw new Error("Weak Password")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

AdminSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

AdminSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

AdminSchema.statics.findByCredentials = async (email, password) => {
    const user = await Admin.findOne({email})

    if(!user) {
        throw new Error("Unable to Login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Unable to Login!")
    }

    return user
}

AdminSchema.pre('save', async function(next) {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin