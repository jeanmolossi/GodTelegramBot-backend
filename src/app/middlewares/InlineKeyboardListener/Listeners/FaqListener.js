import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class FaqListener extends Composer {
  constructor() {
    super();

    this.action('faq', this.faqAction.bind(this));
  }

  async faqAction(context, next) {
    if (!context.update.callback_query) return next();
    try {
      await context.editMessageText(
        `Abaixo estão as dúvidas mais frequentes de nossos usuários\n` +
          `Sobre o que você deseja saber mais?`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Sobre o registro', 'moreRegister')],
            [m.callbackButton('Sobre os comandos', 'moreCommands')],
            [m.callbackButton('Sobre os Grupos', 'moreGroups')],
            [m.callbackButton('Sobre minhas compras', 'moreBuys')],
            [m.callbackButton('Sobre os Alertas', 'moreWarns')],
            [m.callbackButton('Voltar', 'firstMenuStartAction')],
          ])
        )
      );
    } catch (error) {
      return false;
    }
    return next();
  }
}

export default new FaqListener();
