import dotenv from 'dotenv';
import { AppServer } from './AppServer';
dotenv.config();

const server = new AppServer();
server.listen();


