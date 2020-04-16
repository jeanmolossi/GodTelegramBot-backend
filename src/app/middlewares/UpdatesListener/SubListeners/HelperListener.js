import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class HelperListener extends Composer {
  constructor(subject) {
    super();

    this.subject = subject;

    this.action('howWorkDel', this.howWorkDel.bind(this));
    this.action('howWorkLogDel', this.howWorkLogDel.bind(this));
  }

  async howWorkDel(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /del é muito simples.\nServe apenas para apagar a mensagem ` +
          `de todos os registros. Ela não aparecerá para ninguém mais`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona /logdel ?', 'howWorkLogDel')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkLogDel(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /logdel é muito simples.\nServe apenas para apagar a mensagem ` +
          `de todos os registros. Ela não aparecerá para ninguém mais.\n\n` +
          `O /logdel tem um adicional de salvar a mensagem antes de exluí-la`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona /del ?', 'howWorkDel')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
