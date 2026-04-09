import { Router } from 'express';
import { contactRateLimit } from '../middleware/contactRateLimit.js';
import { submitContactForm } from '../controllers/contactController.js';

const router = Router();

router.post('/', contactRateLimit, submitContactForm);

export default router;
