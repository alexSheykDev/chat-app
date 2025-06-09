import { Router, Request, Response } from 'express';
import { BaseRoute } from './BaseRoute';
import { ChatController } from '../Controllers/ChatController';

export class ChatRoute extends BaseRoute {
  public path = '/api/chats';
  public router = Router();
  private controller = new ChatController();

  constructor() {
    super();
    this.initializeRoutes();
    this.logInitialized();
  }

  private initializeRoutes(): void {
    this.router.post('/', (req: Request, res: Response) =>
      this.controller.createChat(req, res)
    );

    this.router.post('/group-chat', (req: Request, res: Response) =>
      this.controller.createGroupChat(req, res)
    );

    this.router.get('/:userId', (req: Request, res: Response) =>
      this.controller.findUserChats(req, res)
    );

    this.router.get('/find/:firstId/:secondId', (req: Request, res: Response) =>
      this.controller.findChat(req, res)
    );

    this.router.patch('/:chatId/:messageId', (req: Request, res: Response) =>
      this.controller.updateChatLastMessage(req, res)
    );
  }
}

export default new ChatRoute().router;
