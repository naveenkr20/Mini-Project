const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const midAdminSchema = new mongoose.Schema({
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
    position : {
        type : String,
        required : true
    },
    department: {
        type: String,
        //required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

midAdminSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

midAdminSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

midAdminSchema.statics.findByCredentials = async (email, password) => {
    const user = await midAdmin.findOne({email})

    if(!user) {
        throw new Error("Unable to Login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Unable to Login!")
    }

    return user
}

midAdminSchema.pre('save', async function(next) {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

const midAdmin = mongoose.model('midAdmin', midAdminSchema)

module.exports = midAdmin