import Composer from 'telegraf';

import { warn } from '../../../../Utils/groupUtils';

export default class SpamMessage extends Composer {
  constructor(database) {
    super();

    this.database = database;
    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {
    try {
      if (
        !(await this.database.ruleMethods.hasThatRule(
          context.message.chat.id,
          'DENY_SPAM'
        ))
      ) {
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

      if (
        !(await this.database.spamMethods.hasSpam(
          context.message.chat.id,
          words
        ))
      ) {
        return next();
      }

      if (
        (await warn(
          context,
          this.database,
          context.message.from.id,
          1,
          'Enviou SPAM!'
        )) > 0
      ) {
        await context.deleteMessage();
      }
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
