import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

import { unwarn } from '../../../../../Utils/groupUtils';

class UnwarnCommand extends Composer {
  constructor() {
    super();

    this.command('unwarn', this.commandAction.bind(this));
  }

  async commandAction(context, next) {
    let number = parseInt(
      context.message.text.replace(/^\/unwarn@?[a-zA-Z]* /, ''),
      10
    );
    if (Number.isNaN(number)) number = 1;
    console.log(number);

    if ('reply_to_message' in context.message) {
      try {
        await unwarn(
          context,
          context.message.reply_to_message.from.id,
          number,
          'Comando de administrador ou acima'
        );
      } catch (error) {
        console.log(error);
      }
      return next();
    }
    await context.deleteMessage();
    await context.telegram.sendMessage(
      context.message.from.id,
      `Vi que você tentou usar o comando /unwarn. Para funcionar, ` +
        `você tem que responder a mensagem do usuário que você quer remover pontos, ` +
        `campeão!`,
      Extra.markup((m) =>
        m.inlineKeyboard([
          [m.callbackButton('Como usar /unwarn', 'howWorkUnwarn')],
        ])
      )
    );
    return next();
  }
}

export default new UnwarnCommand();
