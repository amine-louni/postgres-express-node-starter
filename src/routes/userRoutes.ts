
import express, { Router } from 'express';
import { updatePasswordValidator, userForgotPassword, userLoginValidator, userRegisterValidator, userResetPassword, userValidateEmailValidator } from '../middlewares/validators/authValidators';
import { forgotPassword, login, protect, register, resetPassword, updatePassword, validateEmail } from '../controllers/authController'
import { getUser, updateMe } from '../controllers/userController';


const router: Router = express.Router();



// Auth 🔐
router.post('/auth/register', userRegisterValidator, register);
router.post('/auth/login', userLoginValidator, login);
router.patch('/auth/validate-email', protect, userValidateEmailValidator, validateEmail);
router.patch('/auth/forgot-password', userForgotPassword, forgotPassword);
router.patch('/auth/reset-password', userResetPassword, resetPassword);
router.patch('/auth/update-password', updatePasswordValidator, protect, updatePassword)


// User data

router.get('/:uuid', getUser)
router.patch('/update-me', protect, updateMe)



export default router;
