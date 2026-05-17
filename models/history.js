const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    walletId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'wallet'
    },
    credit: {
        type: Number
    },
    debit: {
       type: Number
   },
}, {timestamps: true})

const historyModel = mongoose.model('history', historySchema)

module.exports = historyModel