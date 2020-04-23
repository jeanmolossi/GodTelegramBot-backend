import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

import RuleMethods from '../../../../database/methods/Rule';

class BotMessage extends Composer {
  constructor() {
    super();

    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    if (!context.message) return next();
    const { chat, from } = context.message;
    let hasRule = false;

    const issetBotMsghasThatRule = context.appState.utils.getState(
      'BotMsghasThatRule'
    );

    if (issetBotMsghasThatRule !== undefined) {
      hasRule = issetBotMsghasThatRule;
    } else {
      hasRule = await RuleMethods.hasThatRule(chat.id, 'DENY_BOT');
      context.appState.utils.addToState({
        BotMsghasThatRule: hasRule,
      });
    }

    if (!hasRule) {
      return next();
    }

    if (!(from.is_bot && from.id !== process.env.BOT_BOT_ID)) {
      return next();
    }

    if ((await warn(context, from.id, 3, 'Bot mensageiro')) > 0) {
      await context.deleteMessage();
    }
  }
}

export default new BotMessage();
