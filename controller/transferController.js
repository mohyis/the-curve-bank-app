const transferModel = require('../models/transfer')
const userModel = require('../models/user')
const walletModel = require('../models/wallet')
const historyModel = require('../models/history')

exports.transferFunds = async(req, res, next)=>{
    try {
        const {id} = req.user
        const { fromAccount, recipientAccountNumber, amount, memo } = req.body
        const getRecipient = await walletModel.findOne({accountNumber: recipientAccountNumber})
        const sender = await walletModel.findOne({userId: id, accountType: fromAccount})
    
        if (!getRecipient){
            return res.status(404).json({
                message: 'invalid account number'
            })
        }
        if (sender.accountNumber == recipientAccountNumber){
            return res.status(400).json({
                message: 'cannot send to same account'
            })
        }
        if(sender.balance < amount){
            return res.status(400).json({
                message: 'insufficient balance'
            })
        }

        const transfer = await transferModel.create({
            userId: id,
            walletId: sender._id,
            fromAccount,
            recipientFullName: getRecipient.fullName,
            recipientAccountNumber,
            amount,
            memo
        })

            getRecipient.accountBalance += transfer.amount;
            sender.accountBalance -= transfer.amount;

        await getRecipient.save()
        await sender.save()

        await historyModel.create({
        walletId: sender._id,
        debit: transfer.amount,
        });
        
        await historyModel.create({
        walletId: getRecipient._id,
        credit: transfer.amount,
        });
    
        const data = {
            recipientFullName: transfer.recipientFullName,
            amount: transfer.amount
        }

        res.status(200).json({
            message: 'transfer successful',
            data
        })
        
    } catch (error) {
        next(error)
    }
}