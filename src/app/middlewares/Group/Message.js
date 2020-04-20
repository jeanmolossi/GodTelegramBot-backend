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

class Message extends Composer {
  constructor() {
    super();

    // MESSAGES TYPES
    this.use(SpamMessage);
    this.use(FloodMessage);
    this.use(BotMessage);

    // FORWARD MESSAGE TYPES
    this.use(BotForwardMessage);
    this.use(ChatForwardMessage);

    // FILE && LINK MESSAGES RULES
    this.use(LinkMessage);
    // this.use(new FileMessage(database));
  }
}

export default new Message();
