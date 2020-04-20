import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import FullUserBuyCatalogUtil from '../../../../Utils/UserMethods/FullUserBuyCatalogUtil';

class BuysListener extends Composer {
  constructor() {
    super();

    this.action('myBuys', this.myBuys.bind(this));
  }

  async myBuys(context, next) {
    console.log(context);
    if (!context.update.callback_query) return next();
    const { message } = context.update.callback_query;
    try {
      const userBuys = await FullUserBuyCatalogUtil.run({
        userTgId: message.chat.id,
      });
      await context.answerCbQuery();
      await context.editMessageText(
        `Só um minutinho, vou listar suas compras...`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Voltar', 'firstMenuStartAction')],
          ])
        )
      );
      if (userBuys && userBuys.Buys) {
        const buys = userBuys.Buys.map((buy) => {
          const signDate = formatDistance(buy.signDate, new Date(), {
            addSuffix: true,
            locale: pt,
          });
          let productName = 'Produto não identificado';
          if (buy.Product) {
            console.log(buy.Product);
            productName = buy.Product.productName;
          }
          return (
            `Produto: ${productName}\n` +
            `Código da transação: ${buy.sellCode}\nStatus de assinatura: ${buy.signStatus}\n` +
            `Código da assinatura: ${buy.signCode}\nAssinada há: ${signDate}`
          );
        });
        await context.replyWithMarkdown(
          `*Suas compras*\n\n${buys.join('\n\n')}`
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default new BuysListener();
