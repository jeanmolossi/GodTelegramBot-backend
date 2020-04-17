import Composer from 'telegraf/composer';

export default class DelCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('del', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    if (!('reply_to_message' in context.message)) return next();
    const { message_id } = context.message.reply_to_message;
    let num = parseInt(
      context.message.text.replace(/^\/del@?[a-zA-Z]* /, ''),
      10
    );
    if (Number.isNaN(num)) {
      try {
        await context.telegram.deleteMessage(
          context.message.chat.id,
          parseInt(message_id, 10)
        );
        await context.telegram.deleteMessage(
          context.message.chat.id,
          parseInt(context.message.message_id, 10)
        );
      } catch (error) {
        return error;
      }
    } else {
      let message = 0;
      while (num !== 0 && message <= 100 && message >= -100) {
        try {
          await context.telegram.deleteMessage(
            context.message.chat.id,
            parseInt(message_id + message, 10)
          );

          num += num >= 0 ? 1 : -1;
        } catch (error) {
          return error;
        }
        message += num >= 0 ? 1 : -1;
      }
      await context.telegram.deleteMessage(
        context.message.chat.id,
        parseInt(context.message.message_id, 10)
      );
    }
    // await context.deleteMessage();
    // await context.reply(`DelCommand Oks`);
    return next();
  }
}
