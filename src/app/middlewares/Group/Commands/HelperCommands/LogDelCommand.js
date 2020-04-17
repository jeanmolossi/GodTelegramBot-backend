import Composer from 'telegraf/composer';

export default class LogDelCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('logdel', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    if (!('reply_to_message' in context.message)) return next();
    const { message_id } = context.message.reply_to_message;
    const forwardTo = process.env.BOT_DEV_ID;
    let num = parseInt(
      context.message.text.replace(/^\/logdel@?[a-zA-Z]* /, ''),
      10
    );
    if (Number.isNaN(num)) {
      try {
        await context.telegram.forwardMessage(
          forwardTo, // chat_id the target
          context.message.chat.id, // from_chat_id original chat id
          parseInt(message_id, 10), // message_id
          { disable_notification: false }
        );

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
          await context.forwardMessage(
            forwardTo,
            context.message.chat.id,
            parseInt(message_id + message, 10),
            { disable_notification: true }
          );
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
    return next();
  }
}
