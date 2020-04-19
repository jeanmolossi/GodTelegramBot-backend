import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';

import authMiddleware from '../app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ Hello: 'World' });
});

// BASIC ROUTES
routes.post('/session', SessionController.store);
routes.post('/user', UserController.store);

routes.use(authMiddleware);
routes.get('/user', UserController.index);
routes.put('/user', UserController.update);
routes.delete('/user', UserController.delete);

export default routes;
