import { Router } from 'express';
import { getMatchingUsersCount } from '../controller/api-controller';

const router = Router();

router.get('/', (req, res) => {res.send('Hello from matching service!')}); // Test route
router.get('/match/count', getMatchingUsersCount); // Retrieve the count of users matching

export const matchingRoutes = router;
