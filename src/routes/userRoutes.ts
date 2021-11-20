
import express, { Router } from 'express';
import { login, register, validateEmail } from '../controllers/authController'
import { getUser } from '../controllers/userController';


const router: Router = express.Router();



// Auth 🔐
router.post('/register', register);
router.post('/login', login);
router.patch('/validate-email', validateEmail);


// User data

router.get('/:uuid', getUser)



export default router;
