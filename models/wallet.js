const mongoose = require('mongoose')

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
     accountType: {
        type: String,
        enum: ['savings', 'current', 'Owealth'],
        default: 'savings',
        require: true
    },
    accountName: {
        type: String,
        require: true
    },
    accountNumber: {
       type: Number,
       require: true
   },
    accountBalance: {
        type: Number,
        default: 20000
    }
}, {timestamps: true})

const walletModel = mongoose.model('wallet', walletSchema)

module.exports = walletModel