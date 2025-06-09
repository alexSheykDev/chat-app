import { Router, Request, Response } from 'express';
import { BaseRoute } from './BaseRoute';
import { MessageController } from '../Controllers/MessageController';

export class MessageRoute extends BaseRoute {
  public path = '/api/messages';
  public router = Router();
  private controller = new MessageController();

  constructor() {
    super();
    this.initializeRoutes();
    this.logInitialized();
  }

  private initializeRoutes(): void {
    this.router.post('/', (req: Request, res: Response) => this.controller.createMessage(req, res));

    this.router.get('/:chatId', (req: Request, res: Response) => this.controller.getMessages(req, res));

    this.router.get('/find/:messageId', (req: Request, res: Response) => this.controller.getMessageById(req, res));
  }
}

export default new MessageRoute().router;
