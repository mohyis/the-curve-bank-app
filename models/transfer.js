const mongoose = require('mongoose')

const transferSchema = new mongoose.Schema({
    userId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        require: true
    },
    walletId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'wallet',
        require: true
    },
    fromAccount: {
        type: String,
        enum: ['savings', 'current', 'Owealth'],
        require: true
    },
    recipientFullName: {
        type: String,
        require: true
    },
    recipientAccountNumber: {
        type: Number,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    memo: {
        type: String
    }
}, {timestamps: true})

const transferModel = mongoose.model('transfer', transferSchema)

module.exports = transferModel