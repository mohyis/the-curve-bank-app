const router = require('express').Router();
const { createWallet, getWallets, getWallet, availableBalance } = require('../controller/walletController');
const { transferFunds } = require('../controller/transferController');
const { signUp, getUser, getAllUser, updateUser, deleteUser, resendOTP, verifyEmail, login } = require('../controller/userController');
const { verifyLogin } = require('../middleware/validation');
const {rate, rateTransfer } = require('../middleware/rateLimit');


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
 *                 description: The User's country
 *                 example: malaysia
 *               accountNumber:
 *                 type: number
 *                 description: The User phone number
 *                 example: +2348029837465
 *               balance:
 *                 type: number
 *                 description: The User phone number
 *                 example: +2348029837465
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
router.post('/login', rate ,login)
router.get('/getuser', rate, verifyLogin, getUser)
router.get('/getall', getAllUser)
router.put('/updateUser/:id', updateUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/resend', rate, resendOTP)
router.post('/verify', verifyEmail)

router.post('/wallet', rate, verifyLogin, createWallet)
router.get('/getwallet', verifyLogin, getWallet)
router.get('/wallets', getWallets)

router.post('/transfer', rateTransfer , verifyLogin, transferFunds)

router.get('/total', verifyLogin, availableBalance)


module.exports = router