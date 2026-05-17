const router = require('express').Router();
const { createWallet, getWallets, getWallet, availableBalance } = require('../controller/walletController');
const { transferFunds } = require('../controller/transferController');
const { signUp, getUser, getAllUser, updateUser, deleteUser, resendOTP, verifyEmail, login } = require('../controller/userController');
const { verifyLogin } = require('../middleware/validation');
const {rate, rateTransfer } = require('../middleware/rateLimit');


/**
 * @swagger
 * tags:
 *   name: User
 *   description: user management and authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The User Id
 *           example: 787674563782983746578439
 *         fullName:
 *           type: string
 *           description: The User's name
 *           example: john doe
 *         email:
 *           type: string
 *           description: The User's email
 *           example: example@example.com
 *         accountType:
 *           type: string
 *           description: users account choice
 *           example: savings
 *         accountNumber:
 *           type: number
 *           description: The User acount number
 *           example: 8029837465
 *         balance:
 *           type: number
 *           description: account balance
 *           example: 8029837465
 *         password:
 *           type: string
 *           description: The User's password
 *           example: password123
 *         isVerified:
 *           type: boolean
 *           description: The User verification status
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The User creation date
 *           example: 2026-05-04
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The User update time
 *           example: 2026-05-04
 */


/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: User registration
 *     description: Register a new user with email, password and other details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The user's name
 *                 example: john doe
 *               email:
 *                 type: string
 *                 description: The User's email
 *                 example: example@example.com
 *               accountType:
 *                 type: string
 *                 description: The User's account preference
 *                 example: current
 *               accountNumber:
 *                 type: number
 *                 description: The User account number
 *                 example: 8029837465
 *               balance:
 *                 type: number
 *                 description: The User account balance
 *                 example: 80295
 *               password:
 *                 type: string
 *                 description: The User's password
 *                 example: password123
 *     responses:
 *       201:
 *         description: user registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: a success message
 *                   example: user reg successfully
 */
router.post('/register', signUp)

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User Login
 *     description: Users log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The User's email
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: The User's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: user login interface
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: a success message
 *                   example: user login successfully
 */
router.post('/login', rate ,login)
router.get('/getuser', rate, verifyLogin, getUser)

/**
 * @swagger
 * /api/v1/user/getall:
 *   get:
 *     tags:
 *       - User
 *     summary: All User
 *     description: Get all user
 *     responses:
 *       200:
 *         description: list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The User Id
 *                         example: 787674563782983746578439
 *                       fullName:
 *                         type: string
 *                         description: The User full name
 *                         example: john
 *                       email:
 *                         type: string
 *                         description: The User email
 *                         example: example@example.com
 *                       accountType:
 *                         type: string
 *                         description: The User's account preference
 *                         example: doe
 *                       accountNumber:
 *                         type: string
 *                         description: The User account number
 *                         example: 8029837465
 *                       balance:
 *                         type: string
 *                         description: The User account number
 *                         example: 8029837465
 *                       isVerified:
 *                         type: boolean
 *                         description: The User verification status
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User creation date
 *                         example: 2026-05-04
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: The User update time
 *                         example: 2026-05-04
 * 
 */
router.get('/getall', getAllUser)
router.put('/updateUser/:id', updateUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/resend', rate, resendOTP)
router.post('/verify', verifyEmail)

router.post('/wallet', rate, verifyLogin, createWallet)
router.get('/getwallet', verifyLogin, getWallet)
router.get('/wallets', getWallets)

/**
 * @swagger
 * /api/v1/user/transfer:
 *   post:
 *     summary: Funds transfer
 *     description: send funds to other users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccount:
 *                 type: string
 *                 description: a user's wallet account
 *                 example: savings
 *               recipientFullName:
 *                 type: string
 *                 description: The receivers Name
 *                 example: Real Mei
 *               recipientAccountNumber:
 *                 type: number
 *                 description: The receivers account number
 *                 example: 6789876543
 *               amount:
 *                 type: number
 *                 description: The User account number
 *                 example: 80295
 *               memo:
 *                 type: string
 *                 description: The User account balance
 *                 example: for dinner
 *     responses:
 *       201:
 *         description: transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: a success message
 *                   example: user reg successfully
 */
router.post('/transfer', rateTransfer , verifyLogin, transferFunds)

router.get('/total', verifyLogin, availableBalance)


module.exports = router