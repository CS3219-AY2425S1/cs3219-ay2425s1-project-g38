import { Router } from 'express';
import { templateController } from '../controller/template-controller';

const router = Router();

router.get('/', templateController.home);

export default router;
