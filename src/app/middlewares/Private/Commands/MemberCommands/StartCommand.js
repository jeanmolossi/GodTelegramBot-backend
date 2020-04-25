import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class StartCommand extends Composer {
  constructor() {
    super();

    this.command('start', this.commandAction.bind(this));
    // this.command('help', this.commandAction.bind(this));
    return this;
  }

  async commandAction(context, next) {
    await context.reply(
      `Opa, tudo bem! Fico feliz em falar com você!\nDo que você precisa?`,
      Extra.markup(m =>
        m.inlineKeyboard([
          [m.callbackButton('Me registrar', 'register')],
          [m.callbackButton('Meus comandos', 'myCommands')],
          [m.callbackButton('Meus grupos', 'myGroups')],
          [m.callbackButton('Minhas compras', 'myBuys')],
          [m.callbackButton('Meus alertas', 'myWarns')],
          [m.callbackButton('Perguntas frequentes e Ajuda', 'faq')],
        ])
      )
    );
  }
}

export default new StartCommand();
