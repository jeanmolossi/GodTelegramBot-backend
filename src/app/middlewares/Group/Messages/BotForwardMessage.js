import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

import RuleMethods from '../../../../database/methods/Rule';

class BotForwardMessage extends Composer {
  constructor() {
    super();

    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    const { chat, from } = context.message;
    if (!context.message) return next();
    if (!(await RuleMethods.hasThatRule(chat.id, 'DENY_BOT_FORWARD'))) {
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

export default new BotForwardMessage();
