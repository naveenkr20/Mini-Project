const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(x) {
            if(!validator.isEmail(x)) {
                throw new Error("Email is invalid")
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        validate(x) {
            if(!validator.isMobilePhone(x)) {
                throw new Error("Mobile number is invalid")
            }
        }
    },
    department: {
        type: String,
        required: true,
        trim: true

    },
    designation: {
        type: String,
        required: true,
        trim: true

    },
    isOnLeave: {
        type: Boolean,
        required: true
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
    gender: {
        type: String,
        required: true,
    },
    leavesLeft: {
        cl: {
            type: Number,
            required: true,
            default:8
        },
        el: {
            type: Number,
            required: true,
            default:10
        },
        rh: {
            type: Number,
            required: true,
            default:2
        },
        hpl: {
            type: Number,
            required: true,
            default:10
        }
        // compOff: {
        //     type : Number,
        //     required: true,
        //     default:5
        // }
    },
    parents: [mongoose.Schema.Types.ObjectId],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error("Unable to Login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Unable to Login!")
    }

    return user
}

UserSchema.pre('save', async function(next) {
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User