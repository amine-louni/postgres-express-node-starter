const express = require('express');
import { login, register } from '../controllers/authController'


const router = express.Router();




router.post('/register', register);
router.post('/login', login);




export default router;
