import Composer from 'telegraf';

// MESSAGES TYPES
import SpamMessage from './Messages/SpamMessage';
import FloodMessage from './Messages/FloodMessage';
import BotMessage from './Messages/BotMessage';

// FORWARD MESSAGE TYPES
import BotForwardMessage from './Messages/BotForwardMessage';
import ChatForwardMessage from './Messages/ChatForwardMessage';

// FILE && LINK MESSAGES RULES
import LinkMessage from './Messages/LinkMessage';
// import FileMessage from './Messages/FileMessage';

export default class Message extends Composer {
  constructor(database, subject) {
    super();

    // MESSAGES TYPES
    this.use(new SpamMessage(database, subject));
    this.use(new FloodMessage(database, subject));
    this.use(new BotMessage(database, subject));

    // FORWARD MESSAGE TYPES
    this.use(new BotForwardMessage(database, subject));
    this.use(new ChatForwardMessage(database, subject));

    // FILE && LINK MESSAGES RULES
    this.use(new LinkMessage(database, subject));
    // this.use(new FileMessage(database));
  }
}
