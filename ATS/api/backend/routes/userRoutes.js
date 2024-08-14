import express from 'express';
const  router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
import ContactController from '../controllers/contactController.js';



// Protected Routes
router.post('/changepassword',checkUserAuth, UserController.changeUserPassword)
router.get('/loggedUser',checkUserAuth, UserController.loggedUser)

// Public Routes
router.post('/register', UserController.userRegistration )
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendPasswordResetEmail)
router.post('/reset-password/:userId/:token', UserController.userPasswordReset)
router.post('/', ContactController.createContact);
//router.post('/send-otp', UserController.sendOTP) 
//router.post('/verify-otp', UserController.verifyOTP) 




export default router
