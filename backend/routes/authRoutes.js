import express from 'express';
import { register, login, self } from '../controllers/authController.js';
import { registerValidate, loginValidate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidate, register);
router.post('/login', loginValidate, login);
router.get('/me', protect, self);

const authRoutes = router;

export default authRoutes;