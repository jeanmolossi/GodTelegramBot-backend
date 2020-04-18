import Composer from 'telegraf/composer';

export default class ReloadCommand extends Composer {
  constructor(database, subject) {
    super();
    this.database = database;
    this.subject = subject;
    this.command('reload', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    try {
      const { message } = context.update;
      const botFunctions = await context.telegram.getChatMember(
        message.chat.id,
        process.env.BOT_ID
      );
      if (botFunctions.status !== 'administrator') {
        await context.reply(
          `❌ Preciso ser administrador para trabalhar direito`
        );
      } else {
        await context.reply(`✅ Parece que está tudo configurado!`);
      }
      await this.subject.notify('newChat', {
        groupTgId: message.chat.id,
        groupName: message.chat.title,
        adminTgId: message.from.id,
        context,
      });
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
