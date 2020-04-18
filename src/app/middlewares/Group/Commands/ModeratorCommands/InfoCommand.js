import Composer from 'telegraf/composer';

export default class InfoCommand extends Composer {
  constructor(database, subject) {
    super();
    this.database = database;
    this.subject = subject;
    this.command('info', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    const { message } = context.update;
    try {
      if (!('reply_to_message' in message)) return next();
      const infoMember = await context.telegram.getChatMember(
        message.chat.id,
        message.reply_to_message.from.id
      );
      await this.subject.notify('infoCommand', {
        infoMember,
        toTgId: message.from.id,
        context,
      });
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
