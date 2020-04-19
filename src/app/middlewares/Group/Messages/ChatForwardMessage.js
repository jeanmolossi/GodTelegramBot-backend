import Composer from 'telegraf';
import { warn } from '../../../../Utils/groupUtils';

export default class ChatForwardMessage extends Composer {
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
        'DENY_CHAT_FORWARD'
      ))
    ) {
      return next();
    }

    if (
      !(
        ('forward_from_chat' in context.message &&
          context.message.forward_from_chat.type === 'channel') ||
        'forward_from_message_id' in context.message
      )
    ) {
      return next();
    }
    console.log(context.message);
    if (
      (await warn(
        context,
        this.database,
        from.id,
        1,
        'Encaminhando mensagens...'
      )) > 0
    ) {
      await context.deleteMessage();
    }
    return next();
  }
}
