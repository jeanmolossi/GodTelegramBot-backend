import Composer from 'telegraf/composer';

export default class UnbanCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('unban', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    try {
      const { message } = context.update;
      if (!('reply_to_message' in message)) return next();

      const { permissions, type } = await context.telegram.getChat(
        context.message.chat.id
      );

      if (type === 'supergroup') {
        context.telegram.restrictChatMember(
          context.message.chat.id,
          context.message.reply_to_message.from.id,
          permissions
        );
      }
      await context.deleteMessage();
      await context.telegram.sendMessage(message.from.id, `Usuário desbanido.`);
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
