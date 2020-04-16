import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

export default class WarnsListener extends Composer {
  constructor(database, subject) {
    super();

    this.database = database;
    this.subject = subject;

    this.action('myWarns', this.myWarns.bind(this));
    this.action('moreWarns', this.moreWarns.bind(this));
    this.action('whatWarns', this.whatWarns.bind(this));
    this.action('whatGroupsWarns', this.whatGroupsWarns.bind(this));
  }

  async myWarns(context, next) {
    if (!context.update.callback_query) return next();
    const { message } = context.update.callback_query;
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Vou trazer para você um relatório de sua conduta...\n`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Voltar', 'firstMenuStartAction')],
          ])
        )
      );
      const userWarns = await this.database.userMethods.userWarnsByTgId(
        message.chat.id
      );
      if (userWarns && userWarns.Groups) {
        const warns = userWarns.Groups.map((group) => {
          let alertFormat = 'Você não possui alertas';
          if (group.UserGroup.warnsNumber === 1)
            alertFormat = `Você possui 1 alerta`;
          else if (group.UserGroup.warnsNumber > 1)
            alertFormat = `Você possui ${group.UserGroup.warnsNumber} alertas`;
          return `Em relação ao Grupo ${group.name}:\n${alertFormat}\n`;
        });
        await context.replyWithMarkdown(
          `*Seu relatório de conduta:*\n\n${warns.join('\n\n')}\n\n` +
            `Reforçando que o limite de alertas por grupo são 3. Ao atingir 3 alertas ` +
            `em um grupo, você é automaticamente banido, até que seja reestabelecido ` +
            `seu acesso.`
        );
      }
    } catch (error) {
      return false;
    }
    return next();
  }

  async moreWarns(context, next) {
    if (!context.update.callback_query) return next();
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Qual sua dúvida sobre os alertas?\n`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Tenho alertas?', 'myWarns')],
            [m.callbackButton('O que são os alertas?', 'whatWarns')],
            [m.callbackButton('Que grupos dão alertas?', 'whatGroupsWarns')],
            [m.callbackButton('Voltar', 'faq')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async whatWarns(context, next) {
    if (!context.update.callback_query) return next();
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Os alertas são uma forma de controlar a conduta dos usuários.\n\n` +
          `Usuários que quebram as regras do grupo ou tem um mau comportamento ` +
          `recebem punições que são atribuidas como pontos em alertas\n\n` +
          `A partir do 3 ponto de alerta você é automaticamente banido do grupo`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Tenho alertas?', 'myWarns')],
            [m.callbackButton('Voltar', 'moreWarns')],
            [m.callbackButton('Voltar ao início', 'firstMenuStartAction')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async whatGroupsWarns(context, next) {
    if (!context.update.callback_query) return next();
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Somente grupos em que os administradores ativarem a minha moderação`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Voltar', 'moreWarns')],
            [m.callbackButton('Voltar ao início', 'firstMenuStartAction')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}
