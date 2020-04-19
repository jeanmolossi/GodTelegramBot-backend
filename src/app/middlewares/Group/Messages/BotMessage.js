import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

export default class BotMessage extends Composer {
  constructor(database) {
    super();

    this.database = database;
    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    const { chat, from } = context.message;
    if (!(await this.database.ruleMethods.hasThatRule(chat.id, 'DENY_BOT'))) {
      return next();
    }

    if (!(from.is_bot && from.id !== process.env.BOT_BOT_ID)) {
      return next();
    }

    if (
      (await warn(context, this.database, from.id, 3, 'Bot mensageiro')) > 0
    ) {
      await context.deleteMessage();
    }
  }
}
