import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class FaqCommand extends Composer {
  constructor() {
    super();

    this.command('faq', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    await context.replyWithHTML(
      `FaqCommand Ok`,
      Extra.HTML().markup((m) =>
        m
          .inlineKeyboard([
            m.urlButton(
              'Perguntas frequentes e Ajuda',
              `${process.env.PANEL_URL}/ajuda`
            ),
          ])
          .resize()
      )
    );
  }
}

export default new FaqCommand();
