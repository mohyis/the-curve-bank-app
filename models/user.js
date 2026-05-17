const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
     fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    accountType: {
        type: String,
        enum: ['savings', 'current', 'Owealth'],
    },
    accountNumber: {
        type: Number,
    },
    balance: {
        type: Number,
        default: 0,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    otpExpiresAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel