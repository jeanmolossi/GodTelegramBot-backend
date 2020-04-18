import Composer from 'telegraf/composer';

export default class BanCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('ban', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    try {
      const { message } = context.update;
      if (!('reply_to_message' in message)) return next();
      const { reply_to_message } = message;
      const permissions = {
        can_send_messages: false,
        can_change_info: false,
        can_invite_users: false,
        can_pin_messages: false,
      };
      const until_date = new Date().getTime() / 1000;
      if (reply_to_message.chat.type === 'supergroup') {
        await context.telegram.restrictChatMember(
          reply_to_message.chat.id,
          reply_to_message.from.id,
          { permissions, until_date }
        );
      }
      await context.telegram.kickChatMember(
        reply_to_message.chat.id,
        reply_to_message.from.id,
        { until_date }
      );
      await context.deleteMessage();
      await context.telegram.sendMessage(message.from.id, `Usuário banido.`);
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
