import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class StartCommand extends Composer {
  constructor(database, subject) {
    super();
    this.database = database;
    this.observer = subject;

    this.command('start', this.commandAction.bind(this));
    return this;
  }

  async commandAction(context, next) {
    await context.reply(
      `Opa, tudo bem! Fico feliz em falar com você!\nDo que você precisa?`,
      Extra.markup((m) =>
        m.inlineKeyboard([
          [m.callbackButton('Me registrar', 'register')],
          [m.callbackButton('Meus comandos', 'myCommands')],
          [m.callbackButton('Perguntas frequentes e Ajuda', 'faq')],
        ])
      )
    );
  }
}
