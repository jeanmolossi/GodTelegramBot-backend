import TelegrafInlineMenu from 'telegraf-inline-menu';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import FullUserBuyCatalogUtil from '../../../Utils/UserMethods/FullUserBuyCatalogUtil';

const mybuysSubmenu = new TelegrafInlineMenu(
  'Toque no botão abaixo para receber sua lista de compras.'
);

async function myBuys(context, next) {
  // console.log(context);
  if (!context.update.callback_query) return next();
  const { message } = context.update.callback_query;

  const userBuys = await FullUserBuyCatalogUtil.run({
    userTgId: message.chat.id,
  });
  if (userBuys && userBuys.Buys) {
    const buys = userBuys.Buys.map((buy) => {
      const signDate = formatDistance(buy.signDate, new Date(), {
        addSuffix: true,
        locale: pt,
      });
      let productName = 'Produto não identificado';
      if (buy.Product) {
        // console.log(buy.Product);
        productName = buy.Product.productName;
      }
      return (
        `Produto: ${productName}\n` +
        `Código da transação: ${buy.sellCode}\nStatus de assinatura: ${buy.signStatus}\n` +
        `Código da assinatura: ${buy.signCode}\nAssinada há: ${signDate}`
      );
    });
    await context.replyWithMarkdown(`*Suas compras*\n\n${buys.join('\n\n')}`);
  }
  return true;
}

mybuysSubmenu.button('Receber lista', 'receiveBuys', {
  doFunc: (_ctx, next) => {
    myBuys(_ctx, next);
  },
  setParentMenuAfter: () => true,
});

export default mybuysSubmenu;
