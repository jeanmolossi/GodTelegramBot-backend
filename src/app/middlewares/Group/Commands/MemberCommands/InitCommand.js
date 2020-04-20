import Composer from 'telegraf/composer';

export default class InitCommand extends Composer {
  constructor(database) {
    super();
    this.database = database;
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

    await this.database.groupMethods.findOrCreateGroup({
      groupTgId: chat.id,
      groupName: chat.title,
      adminTgId: from.id,
    });
    await context.reply(`Inicializações Ok`);
    return next();
  }
}
