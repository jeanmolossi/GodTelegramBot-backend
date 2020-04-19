import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

export default class BotForwardMessage extends Composer {
  constructor(database) {
    super();

    this.database = database;
    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    const { chat, from } = context.message;
    if (
      !(await this.database.ruleMethods.hasThatRule(
        chat.id,
        'DENY_BOT_FORWARD'
      ))
    ) {
      return next();
    }
    if (
      !(
        'forward_from' in context.message && context.message.forward_from.is_bot
      )
    ) {
      return next();
    }

    if (
      (await warn(
        context,
        this.database,
        from.id,
        1,
        'Encaminhando mensagens proibidas de outros bots'
      )) > 0
    ) {
      await context.deleteMessage();
    }
    return next();
  }
}
