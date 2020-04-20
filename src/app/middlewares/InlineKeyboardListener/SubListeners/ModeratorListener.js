import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class ModeratorListener extends Composer {
  constructor() {
    super();

    this.action('howWorkMute', this.howWorkMute.bind(this));
    this.action('howWorkNotification', this.howWorkNotification.bind(this));
    this.action('howWorkInfo', this.howWorkInfo.bind(this));
  }

  async howWorkMute(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /mute serve para mutar um usuário que, geralmente, está abusando ` +
          `no envio de mensagens. ` +
          `\n\nModo de uso: \nResponda à mensage do usuário ` +
          `que deseja mutar, da seguinte forma: \n/mute 15\n\nDessa forma você atribuirá ` +
          `15 minutos de punição ao usuário. O qual não poderá enviar mensagens nesse período`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                'Como funciona o /notificacoes ?',
                'howWorkNotification'
              ),
            ],
            [m.callbackButton('Como funciona o /info ?', 'howWorkInfo')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkNotification(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /notificacoes serve para que eu reúna as notificações destinadas ` +
          `à você. Geralmente tickets de suporte ou atualizações de sistema ou grupo.\n\n` +
          `Modo de Uso:\n/notificacoes `,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona o /mute ?', 'howWorkMute')],
            [m.callbackButton('Como funciona o /info ?', 'howWorkInfo')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkInfo(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /info serve para que você receba pequeno relatório sobre ` +
          `o usuário.\n\n` +
          `Modo de Uso:\nResponda à mensagem do usuário que deseja receber ` +
          `o relatório, da seguinte forma:\n/info\n\nDessa forma ` +
          `você irá receber o relatório do usuário que enviou a mensagem ` +
          `a qual você respondeu.`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona o /mute ?', 'howWorkMute')],
            [
              m.callbackButton(
                'Como funciona o /notificacoes ?',
                'howWorkNotification'
              ),
            ],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new ModeratorListener();
