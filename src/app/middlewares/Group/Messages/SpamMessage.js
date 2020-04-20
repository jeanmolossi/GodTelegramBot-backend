import Composer from 'telegraf';

import { warn } from '../../../../Utils/groupUtils';

import RuleMethods from '../../../../database/methods/Rule';
import SpamMethods from '../../../../database/methods/Spam';

class SpamMessage extends Composer {
  constructor() {
    super();

    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    try {
      const hasRule = await RuleMethods.hasThatRule(
        context.message.chat.id,
        'DENY_SPAM'
      );
      if (!hasRule) {
        return next();
      }
      let words = [];
      // console.log(context.message);
      if (!context.message.caption && context.message.text) {
        words = context.message.text.split(' ');
      }
      if (context.message.caption) {
        words = context.message.caption.split(' ');
      }

      if (!(await SpamMethods.hasSpam(context.message.chat.id, words))) {
        return next();
      }

      if (
        (await warn(context, context.message.from.id, 1, 'Enviou SPAM!')) > 0
      ) {
        await context.deleteMessage();
      }
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new SpamMessage();
