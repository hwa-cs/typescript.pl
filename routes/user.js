import express from 'express';
import { isLoggedIn } from '../middlewares/index.js';
import { follow } from '../controllers/user.js';
const router = express.Router();
router.post('/:id/follow', isLoggedIn, follow);
export default router;
