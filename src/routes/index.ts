import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);

router.get('/', (_req, res) => {
  res.json({ message: 'Real Estate API is running' });
});

export default router;
