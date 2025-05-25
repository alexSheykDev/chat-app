import { Application } from 'express';
import { UserRoute } from './UserRoute';
import { ChatRoute } from './ChatRoute';
import { MessageRoute } from './MessageRoute';

const routes = [
  new UserRoute(),
  new ChatRoute(),
  new MessageRoute(),
];

export function registerRoutes(app: Application): void {
  routes.forEach((route) => {
    app.use(route.path, route.router);
  });
}
