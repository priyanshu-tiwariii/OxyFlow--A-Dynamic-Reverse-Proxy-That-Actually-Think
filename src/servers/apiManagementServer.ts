import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import router from '../routes/index.js';

const apiManagementServer: Express = express();

// Middleware
apiManagementServer.use(express.json());

// Routes
apiManagementServer.use('/api/v1', router);

// Error handling middleware
apiManagementServer.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export const startApiManagementServer = (port: number) => {
  apiManagementServer.listen(port, () => {
    console.log(`API Management Server running on port ${port}`);
  });
}


