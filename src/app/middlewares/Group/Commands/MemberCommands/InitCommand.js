import Composer from 'telegraf/composer';

import EventEmitter from '../../../../../store/EventEmitter';

class InitCommand extends Composer {
  constructor() {
    super();
    this.subject = EventEmitter;
    this.command('init', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    const { from, chat } = context.update.message;
    const { status } = await context.telegram.getChatMember(chat.id, from.id);
    if (status !== 'creator') return next();
    const botFunctions = await context.telegram.getChatMember(
      chat.id,
      process.env.BOT_ID
    );
    if (botFunctions.status !== 'administrator') {
      await context.reply(
        `❌ Preciso ser administrador para trabalhar direito`
      );
      return next();
    }
    this.subject.notify('newChat', {
      groupTgId: chat.id,
      groupName: chat.title,
      adminTgId: from.id,
    });
    await context.reply(`✅ Inicializações Feitas`);
    return next();
  }
}

export default new InitCommand();
