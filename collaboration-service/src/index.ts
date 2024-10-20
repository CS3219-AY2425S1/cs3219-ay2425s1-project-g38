import express, { Application } from 'express';
import router from './routes/template-routes';
import authMiddleware from './middleware/template-middleware';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/api', router);

export default app;
