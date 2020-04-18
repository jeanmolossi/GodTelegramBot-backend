import Composer from 'telegraf/composer';

export default class KickCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
    this.command('kick', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    const { message } = context.update;
    if (!('reply_to_message' in message)) return next();
    const { reply_to_message } = message;

    const until_date = new Date().getTime() / 1000 + 60 * 3;
    await context.telegram.kickChatMember(
      reply_to_message.chat.id,
      reply_to_message.from.id,
      { until_date }
    );
    let group = '';
    if (reply_to_message.chat.type === 'group')
      group = 'Usuário pode retornar com link de convite';
    await context.deleteMessage();
    await context.telegram.sendMessage(
      message.from.id,
      `Usuário expulso. ${group}`
    );
    return next();
  }
}
