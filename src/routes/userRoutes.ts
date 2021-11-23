
import express, { Router } from 'express';
import { updatePasswordValidator } from '../middlewares/validators/authValidators';
import { forgotPassword, login, protect, register, resetPassword, updatePassword, validateEmail } from '../controllers/authController'
import { getUser, updateMe } from '../controllers/userController';


const router: Router = express.Router();



// Auth 🔐
router.post('/auth/register', register);
router.post('/auth/login', login);
router.patch('/auth/validate-email', validateEmail);
router.patch('/auth/forgot-password', forgotPassword);
router.patch('/auth/reset-password', resetPassword);
router.patch('/auth/update-password', updatePasswordValidator, protect, updatePassword)


// User data

router.get('/:uuid', getUser)
router.patch('/update-me', protect, updateMe)



export default router;
