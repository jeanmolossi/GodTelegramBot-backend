import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class CommandsListener extends Composer {
  constructor() {
    super();

    this.action('myCommands', this.myCommands.bind(this));
    this.action('moreCommands', this.moreCommands.bind(this));
  }

  async myCommands(context, next) {
    try {
      await context.answerCbQuery();
      await context.reply(
        `Qual comando você precisa?`,
        Extra.markup((m) =>
          m
            .keyboard([['/start', '/help']])
            .oneTime()
            .resize()
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async moreCommands(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Você pode usar somente alguns comandos. Que são:`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('/start', 'myCommands')],
            [m.callbackButton('/help', 'myCommands')],
            [m.callbackButton('Voltar', 'faq')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new CommandsListener();
