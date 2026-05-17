const userModel = require('../models/user');
const walletModel = require('../models/wallet')
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')



// const OTP = Math.floor(Math.random()* 1e4).toString().padEnd(4, `${Math.floor(Math.random()*10)}`)


exports.signUp = async(req,res,next)=>{
    try {
        
        const {fullName, email, password, confirmPassword} = req.body

        const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const walletGen = otpGenerator.generate(10, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        if (password !== confirmPassword) {
            return next({
                message: 'password mismatch',
                statusCode: 400
            })
        }

        const emailExists = await userModel.findOne({ email: email})
        if (emailExists){
         return next({
            message: 'email already exists', 
            statusCode: 400
         })
        }

        const signup = await userModel.create({
            fullName, 
            email,
            otp: OTP,
            password: hashedPassword,
            otpExpiresAt: expiresAt
        })

        const wallet = await walletModel.create({
                    userId: signup._id, 
                    accountName: signup.fullName,
                    accountNumber: walletGen

                });

                signup.accountType = wallet.accountType
                signup.accountNumber = wallet.accountNumber
                // signup.balance = wallet.accountBalance

                await signup.save()

        const data = {
            fullName: signup.fullName,
            email: signup.email,
            accountNumber: signup.accountNumber,
            accountType: signup.accountType,
            balance: signup.balance
        }

        res.status(201).json({
            message: 'account created',
            data
        })

        
    } catch (error) {
      next({
        message: error.message, 
        statusCode: 500
      })
    }
};

exports.verifyEmail = async(req,res,next)=>{

    try {
        
        const { email, otp } = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return next({
        message: 'user not found',
        statusCode: 404
      })
        };
        if (new Date()> user.otpExpiresAt || user.otp != otp){
            return next({
                message: 'Invalid OTP',
                statusCode: 400
            })

        }

        user.isVerified = true
        user.otp = null
        user.otpExpiresAt = null

        await user.save()

        res.status(200).json({
            message: 'user verified successfully'
        })


    } catch (error) {
       next({
        message: error.message, 
        statusCode: 500
      })
    }
};

exports.resendOTP = async(req,res,next)=>{
    const { email } = req.body;
    const user = await userModel.findOne({email})

        if(!user){
          return next({
        message: 'user not found', 
        statusCode: 404
      })
        };

         const OTP = otpGenerator.generate(4, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
        const expiresAt = new Date(Date.now() + 10 * 60000);

        user.otp = OTP;
        user.otpExpiresAt = expiresAt

        await user.save()

        res.status(200).json({
            message: 'OTP sent successfully'
        })

};

exports.login = async(req,res, next)=>{
    try {
        const {email, password} = req.body
        const user  = await userModel.findOne({email})
        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        };

        if(user.isVerified == false){
            return next({
        message: 'please verify your email', 
        statusCode: 400
      })

        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if(!passwordCorrect){ 
            return next({
        message: 'invalid credentials', 
        statusCode: 400
      })
        }   

        const token = await jwt.sign({ 
            id: user._id, email: user.email}, 
            process.env.JWT_SECRET, 
            { expiresIn: '1 hour'})

        res.status(200).json({
            message: 'login successfully',
            token
        })


    } catch (error) {
        next(error)
    }
}


exports.getAllUser = async(req,res, next)=>{
    try {
        const allUsers = await userModel.find().select('-password')

        res.status(200).json({
            message: 'users found',
            allUsers
        })
    } catch (error) {
        next(error)
    }
};

exports.getUser = async(req,res, next)=>{
    try {
        const {id} = req.user
        
        const user = await userModel.findById(id).select('-password')
        const wallet = await walletModel.find({userId: id})

        if(!user){
            return next({
        message: 'user not found',
        statusCode: 404
      })
        }

        const data = {
            fullName: user.fullName,
            balance: user.balance,

        }

        res.status(200).json({
            message: 'user found',
             data,
             wallet
                
        })
    } catch (error) {
        next(error)
    }
};

exports.updateUser = async(req,res, next)=>{
    try {
         const {id} = req.params
          const {fullName, email, password} = req.body

         const update = {
            fullName, 
            email,
            password
         }
        const user = await userModel.findByIdAndUpdate(id, update, {new: true})

        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        }

        res.status(200).json({
            message: 'user updated',
            user

            })
        
    } catch (error) {
       next(error)
    }
};

exports.deleteUser = async(req, res, next)=>{
    try {
         const {id} = req.params
        
        const user = await userModel.findByIdAndDelete(id)

        if(!user){
            return next({
        message: 'user not found', 
        statusCode: 404
      })
        }

        res.status(200).json({
            message: 'user deleted'

        })
    } catch (error) {
         next(error)
    }
};