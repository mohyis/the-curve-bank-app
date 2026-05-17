const walletModel = require('../models/wallet');
const userModel = require('../models/user')
const otpGenerator = require('otp-generator');

exports.createWallet = async(req, res, next)=>{
    try {
        const {id} = req.user
        const {accountType, accountBalance} = req.body
        const user = await userModel.findById(id)
        const walletGen = otpGenerator.generate(10, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        
        const wallet = await walletModel.create({
            userId: id, 
            accountType,
            accountName: user.fullName,
            accountNumber: walletGen
        });

        res.status(201).json({
            message: 'account created successfully', 
            wallet
        });

    } catch (error) {
        next(error)
    }
}

exports.getWallet = async(req,res, next)=>{
    try {
        const {id} = req.user
        
        const wallet = await walletModel.findById({userId: id})

        if(!wallet){
            return next({
        message: 'wallet not found', 
        statusCode: 404
      })
        }

        res.status(200).json({
            message: 'wallet found',
            wallet

        })
    } catch (error) {
        next(error)
    }
};


exports.getWallets = async(req,res, next)=>{
    try {
        const account = await walletModel.find()

        res.status(200).json({
            message: 'all wallet found',
            account

        })
    } catch (error) {
        next(error)
    }
};

exports.availableBalance = async (req, res, next) => {
    try {

        const { id } = req.user;

        const wallets = await walletModel.find({ userId: id });
        const user = await userModel.findById(id)

        let total = 0;

        for (const wallet of wallets) {
            total += wallet.accountBalance;
        }

        user.balance = total

        await user.save()

        res.status(200).json({
            message: 'Total funds retrieved successfully',
            totalFunds: total
        });

    } catch (error) {
        next(error);
    }
};