import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

class SubModeratorListener extends Composer {
  constructor() {
    super();

    this.action('howWorkWarn', this.howWorkWarn.bind(this));
    this.action('howWorkUnwarn', this.howWorkUnwarn.bind(this));
  }

  async howWorkWarn(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /warn serve para notificar um usuário que está se comportando ` +
          `contra a conduta do grupo. Você pode atribuir 1, 2 ou 3 pontos de alerta ` +
          `\n\nO usuário que atingir 3 pontos de alerta será punido conforme os ` +
          `Administradores definiram\n\nModo de uso: \nResponda à mensage do usuário ` +
          `que deseja alertar, da seguinte forma: \n/warn 1\n\nDessa forma você atribuirá ` +
          `1 ponto de alerta ao usuário`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona /unwarn', 'howWorkUnwarn')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkUnwarn(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /unwarn é o oposto do comando /warn.\nServe para remover ` +
          `pontos atribuidos anteriormente à usuários.\n\n` +
          `Modo de Uso:\nResponda à mensagem do usuário que deseja remover ` +
          `os pontos de alerta da seguinte forma:\n/unwarn 1\n\nDessa forma ` +
          `você irá remover 1 ponto de alerta do usuário.`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona /warn', 'howWorkWarn')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new SubModeratorListener();
