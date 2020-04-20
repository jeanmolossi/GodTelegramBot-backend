import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';
import UserController from '../app/controllers/UserController';
import ConfigController from '../app/controllers/ConfigController';
import ProductController from '../app/controllers/ProductController';
import MultipleProductController from '../app/controllers/MultipleProductController';
import BuyController from '../app/controllers/BuyController';
import GroupController from '../app/controllers/GroupController';
import NotificationController from '../app/controllers/NotificationController';
import GroupManagerController from '../app/controllers/GroupManagerController';

import authMiddleware from '../app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ Hello: 'World', That_is: 'Root path' });
});

// BASIC ROUTES
routes.post('/session', SessionController.store);
routes.post('/config/rehydrate', SessionController.indexConfig);

routes.post('/user', UserController.store);

// ROUTES NEEDED AUTH

routes.use(authMiddleware);
routes.get('/user', UserController.index);
routes.put('/user', UserController.update);
routes.delete('/user', UserController.delete);

// CONFIG API ROUTE

routes.post('/config', ConfigController.store);
routes.get('/config', ConfigController.index);
routes.put('/config', ConfigController.update);
routes.delete('/config', ConfigController.delete);

// SINGLE PRODUCT ROUTE

routes.get('/product/:id', ProductController.index);
routes.post('/product', ProductController.store);
routes.put('/product/:id', ProductController.update);
routes.delete('/product/:id', ProductController.delete);

routes.get('/products', MultipleProductController.index);

// SINGLE BUYS ROUTE BY LOGGED USER

routes.get('/user/buys', BuyController.index);
routes.get('/user/buy/:id', BuyController.index);
routes.post('/user/buys', BuyController.storeSync);
routes.post('/user/buy/add', BuyController.storeRegister);

routes.get('/user/sell', BuyController.indexSell);

// GROUPS ROUTES

routes.get('/groups', GroupController.index);
routes.put('/group/:id', GroupController.update);
routes.delete('/group/:id', GroupController.delete);

// NOTIFICATIONS ROUTES

routes.get('/notifications', NotificationController.index);
routes.post('/notification', NotificationController.store);
routes.put('/notification/:id', NotificationController.update);

// GROUP REPORT MANAGER

routes.get('/group/:id/report', GroupManagerController.index);

export default routes;
