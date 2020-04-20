import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

import FullUserBuyCatalogUtil from '../../../../Utils/UserMethods/FullUserBuyCatalogUtil';

class GroupsListener extends Composer {
  constructor() {
    super();

    this.action('myGroups', this.myGroups.bind(this));

    this.action('moreGroups', this.moreGroups.bind(this));
    this.action('helpMyGroups', this.helpMyGroups.bind(this));
    this.action('brokenButtons', this.brokenButtons.bind(this));
  }

  async myGroups(context, next) {
    if (!context.update.callback_query) return next();

    const { chat } = context.update.callback_query.message;
    const userBoughts = await FullUserBuyCatalogUtil.run({
      userTgId: chat.id, // PRIVATE CHAT IS USER
    });
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Aparecerão abaixo os botões de acesso para seus grupos\n` +
          `Não estão aparecendo os botões? Acesse o menu de ajuda.`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [
              m.callbackButton(
                'Ajuda, meus grupos não aparecem',
                'helpMyGroups'
              ),
            ],
            [m.callbackButton('Voltar', 'firstMenuStartAction')],
          ])
        )
      );
      if (userBoughts && userBoughts.Buys) {
        userBoughts.Buys.map(async (buy) => {
          if (buy.Product) {
            if (buy.Product.Groups) {
              await buy.Product.Groups.map(async (group) => {
                const chatLink = await context.telegram.exportChatInviteLink(
                  group.tgId
                );
                await context.replyWithMarkdown(
                  `[Grupo: ${group.name}](${chatLink})`
                );
              });
            }
          }
          return true;
        });
      }
    } catch (error) {
      return false;
    }

    return next();
  }

  async moreGroups(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Qual sua dúvida sobre seus grupos?`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Link de grupos', 'myGroups')],
            [m.callbackButton('Meus grupos não aparecem', 'helpMyGroups')],
            [
              m.callbackButton(
                'Meus Botões de acesso não funcionam',
                'brokenButtons'
              ),
            ],
            [m.callbackButton('Voltar', 'faq')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async brokenButtons(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Seus botões de link podem não estar funcionando ` +
          `por diversos motivos, entre eles: \n\n` +
          `1 - Você foi banido do grupo\n2 - O grupo não está mais ativo\n3 - ` +
          `Houve um erro com o telegram.\n4 - Você não está com cadastro ativo.\n\n` +
          `De toda forma, vou notificar o Staff.\nAguarde cerca de 5 minutos e ` +
          `tente acessar o botão outra vez.`,
        Extra.markup((m) =>
          m.inlineKeyboard([[m.callbackButton('Voltar', 'moreGroups')]])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }

  async helpMyGroups(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Para seus grupos não estarem aparecendo, ` +
          `provavelmente, seu registro não está ativo`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Ajuda', 'moreGroups')],
            [m.callbackButton('Voltar', 'firstMenuStartAction')],
          ])
        )
      );
    } catch (error) {
      console.log(error);
    }
    return next();
  }
}

export default new GroupsListener();
