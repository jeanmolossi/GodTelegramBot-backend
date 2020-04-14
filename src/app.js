import express from 'express';
import cors from 'cors';
import GodBot from './GodBotApp';
import routes from './routes';

class GodBotApp {
  constructor() {
    this.server = express();
    this.server.use(cors());

    this.middlewares();
    this.routes();

    this.botInit().then((res) => console.log('Bot Started', res));
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  async botInit() {
    this.GodBot = new GodBot(process.env.BOT_TOKEN);
  }
}

export default new GodBotApp().server;
