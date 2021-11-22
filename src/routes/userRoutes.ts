
import express, { Router } from 'express';
import { forgotPassword, login, register, resetPassword, validateEmail } from '../controllers/authController'
import { getUser } from '../controllers/userController';


const router: Router = express.Router();



// Auth 🔐
router.post('/auth/register', register);
router.post('/auth/login', login);
router.patch('/auth/validate-email', validateEmail);
router.patch('/auth/forgot-password', forgotPassword);
router.patch('/auth/reset-password', resetPassword);


// User data

router.get('/:uuid', getUser)



export default router;
