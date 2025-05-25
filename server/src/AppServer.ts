import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
/* import { verifySocketToken } from './middleware/auth'; */

import { registerRoutes } from './Routes';
import { SocketManager } from './sockets';

export class AppServer {
  private app: Application;
  private server: http.Server;
  private io: SocketIOServer;
  private readonly port: number = Number(process.env.PORT) || 5001;
  private readonly mongoURI: string = process.env.ATLAS_URI || '';
  private onlineUsers: Map<string, string> = new Map();
  private socketManager: SocketManager;


  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    this.socketManager = new SocketManager(this.io);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.socketManager.initialize();
    this.connectToDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
      })
    );
  }

  private initializeRoutes(): void {
    registerRoutes(this.app);
  }

  private connectToDatabase(): void {
    mongoose
      .connect(this.mongoURI)
      .then(() => console.log('MongoDB connection established'))
      .catch((error) => console.log(`MongoDB connection failed: ${error.message}`));
  }

  public listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server running on port: ${this.port}`);
    });
  }
}