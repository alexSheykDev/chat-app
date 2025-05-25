// src/routes/UserRoute.ts
import { Router, Request, Response } from 'express';
import { BaseRoute } from './BaseRoute';
import { UserController } from '../Controllers/UserController';


export class UserRoute extends BaseRoute {
  public path = '/api/users';
  public router = Router();
  private controller = new UserController();

  constructor() {
    super();
    this.initializeRoutes();
    this.logInitialized(); // From BaseRoute method
  }

  private initializeRoutes(): void {
    this.router.post('/register', (req: Request, res: Response) => this.controller.registerUser(req, res));
    this.router.post('/login', (req: Request, res: Response) => this.controller.loginUser(req, res));
    this.router.get('/find/:userId', (req: Request, res: Response) => this.controller.findUser(req, res));
    this.router.get('/', (req: Request, res: Response) => this.controller.getUsers(req, res));
  }
}
