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
        `Você pode usar somente alguns comandos.\n` +
          `Porém, dependendo de sua posição no grupo serão habilitados alguns ` +
          `comandos a mais para você usar. Para saber quais são, use /help no ` +
          `grupo ao qual deseja saber.\n\nEsses comandos só ficarão habilitados ` +
          `nos grupos específicos em que você tenha autorização para utilizá-los`,
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
