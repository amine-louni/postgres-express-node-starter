const express = require('express');
import { login, register, validateEmail } from '../controllers/authController'


const router = express.Router();




router.post('/register', register);
router.post('/login', login);
router.patch('/validate-email', validateEmail);




export default router;
