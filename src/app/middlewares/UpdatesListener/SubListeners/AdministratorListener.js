import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class AdministratorListener extends Composer {
  constructor(subject) {
    super();

    this.subject = subject;

    this.action('howWorkSettings', this.howWorkSettings.bind(this));
    this.action('howWorkReload', this.howWorkReload.bind(this));
    this.action('howWorkBan', this.howWorkBan.bind(this));
    this.action('howWorkUnban', this.howWorkUnban.bind(this));
    this.action('howWorkKick', this.howWorkKick.bind(this));
  }

  async howWorkSettings(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O comando /settings serve, basicamente, para ajustar as configurações ` +
          `do grupo. Habilitar ou desabilitar filtros e regras pré-definidas\n\n` +
          `Modo de uso:\n/settings`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Como funciona o /reload ?', 'howWorkReload')],
            [m.callbackButton('Como funciona o /ban ?', 'howWorkBan')],
            [m.callbackButton('Como funciona o /unban ?', 'howWorkUnban')],
            [m.callbackButton('Como funciona o /kick ?', 'howWorkKick')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkReload(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O reload é utilizado para reinicializar o bot no grupo, caso tenha ` +
          `ocorrido algum erro ou o bot não inicializou da maneira correta.\n` +
          `É recomendado utilizar esse comando toda vez que for criado um novo grupo.\n\n` +
          `Modo de uso:\n/reload`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                'Como funciona o /settings ?',
                'howWorkSettings'
              ),
            ],
            [m.callbackButton('Como funciona o /ban ?', 'howWorkBan')],
            [m.callbackButton('Como funciona o /unban ?', 'howWorkUnban')],
            [m.callbackButton('Como funciona o /kick ?', 'howWorkKick')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkBan(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /ban serve para banir completamente um usuário. Este comando ` +
          `funciona *SOMENTE EM SUPERGRUPOS*. Após o usuário ser banido ele só retornará ` +
          `ao grupo após receber /unban ou ser _Manualmente_ adicionado ao grupo.\n\n` +
          `Modo de uso:\nResponda à mensagem do usuário que você deseja banir com o comando\n` +
          `/ban`,
        Extra.markdown().markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                'Como funciona o /settings ?',
                'howWorkSettings'
              ),
            ],
            [m.callbackButton('Como funciona o /reload ?', 'howWorkReload')],
            [m.callbackButton('Como funciona o /unban ?', 'howWorkUnban')],
            [m.callbackButton('Como funciona o /kick ?', 'howWorkKick')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkUnban(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O Comando /unban é o oposto do comando /ban. Este comando ` +
          `funciona *SOMENTE EM SUPERGRUPOS*. Após o usuário ser banido ele só retornará ` +
          `ao grupo após receber /unban ou ser _Manualmente_ adicionado ao grupo.\n\n` +
          `Modo de uso:\nResponda à mensagem do usuário que você deseja desbanir com o comando\n` +
          `/unban`,
        Extra.markdown().markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                'Como funciona o /settings ?',
                'howWorkSettings'
              ),
            ],
            [m.callbackButton('Como funciona o /reload ?', 'howWorkReload')],
            [m.callbackButton('Como funciona o /ban ?', 'howWorkBan')],
            [m.callbackButton('Como funciona o /kick ?', 'howWorkKick')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async howWorkKick(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `O comando /kick serve para expulsar o usuário do grupo. Porém, é possível ` +
          `que ele retorne utilizando o link de convite do chat.\n\nModo de uso:\n` +
          `Responda à mensagem do usuário que você deseja expulsar com o comando ` +
          `/kick`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                'Como funciona o /settings ?',
                'howWorkSettings'
              ),
            ],
            [m.callbackButton('Como funciona o /reload ?', 'howWorkReload')],
            [m.callbackButton('Como funciona o /ban ?', 'howWorkBan')],
            [m.callbackButton('Como funciona o /unban ?', 'howWorkUnban')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
