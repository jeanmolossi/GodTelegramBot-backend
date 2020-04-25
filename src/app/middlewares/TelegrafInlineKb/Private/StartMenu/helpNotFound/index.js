import TelegrafInlineMenu from 'telegraf-inline-menu';

import SendNotificationService from '../../../../../../services/SendNotificationService';
import FullUserBuyCatalogUtil from '../../../../../../Utils/UserMethods/FullUserBuyCatalogUtil';
import ProducerByBuyService from '../../../../../../services/ProducerByBuyService';

/**
 *
 * @param {INITIALIZATION FROM VARS}
 */

const helpNotFound = new TelegrafInlineMenu(
  `Você está com dúvida em relação à que ?`
);
const newButton = new TelegrafInlineMenu(`À qual compra você busca ajuda ?`);

const help = { answer: null };
let hideLoadButton = false;
const transactions = {};
let transactionSelected = {};
let hasSelectedTransaction = false;

/**
 *
 * @param {FUNTIONS NEEDED} context
 */

async function getUserBuys(context) {
  console.log(context.update.callback_query);
  const { from } = context.update.callback_query;
  const user = await FullUserBuyCatalogUtil.run({ userTgId: from.id });
  if (user && user.Buys) {
    await user.Buys.map(async buy => {
      transactions[buy.sellCode] = {};
    });
  } else {
    await context.reply(
      `Você não possui compras sincronizadas. Registre-se antes de solicitar suporte`
    );
  }
  hideLoadButton = true;
}

async function answFunc(ctx, answer) {
  const [sellCode] = Object.keys(transactionSelected);
  const userFrom = ctx.update.message.from.id;
  const { User } = await ProducerByBuyService.run({ sellCode });

  if (User === null) return false;

  const userTo = User.tgId;
  const notificationBody = {
    excerpt: 'Seu cliente precisa de atenção',
    text:
      `Um de seus usuários está com dúvidas. Dê suporte e melhore a experiência ` +
      `dele com seu produto!\n\n${answer}`,
    method: 'Solicitado via bot',
    userTo,
  };
  await SendNotificationService.run({ userFrom, userTo, notificationBody });
}

/**
 *
 * @param {CREATION OF BUTTONS}
 */

newButton.button('Carregar compras...', 'helpForBuy', {
  doFunc: async ctx => getUserBuys(ctx),
  setMenuAfter: true,
  hide: () => hideLoadButton,
});

newButton.select('p', () => Object.keys(transactions), {
  setFunc: (_ctx, key) => {
    transactionSelected = {};
    transactionSelected[key] = true;
    hasSelectedTransaction = true;
  },
  textFunc: (_ctx, key) => {
    return `Transação ${key}`;
  },
  columns: 1,
  isSetFunc: (_ctx, key) => transactionSelected[key],
});

newButton.question('Enviar dúvida...', 'action123', {
  uniqueIdentifier: Math.floor(Math.random() * 190000).toString(),
  questionText: `Qual sua dúvida em relação à trasação selecionada ?`,
  setFunc: answFunc,
  hide: () => !hasSelectedTransaction,
});

helpNotFound.submenu('À uma compra que fiz', 'helpForBuy', newButton);

helpNotFound.question('Em como usar o bot', 'helpMe', {
  uniqueIdentifier: Math.floor(Math.random() * 15000).toString(),
  questionText: 'Qual sua dúvida ao me usar ?',
  setFunc: async (context, answer) => {
    const userFrom = context.update.message.from.id;
    const userTo = process.env.BOT_DEV_ID;
    const notificationBody = {
      excerpt: 'Um usuário está com dificuldades',
      text:
        `Um de seus usuários está com dúvidas. Dê suporte e melhore a experiência ` +
        `dele com seu produto!\n\n${answer}`,
      method: 'Solicitado via bot',
      userTo,
    };

    await context.replyWithMarkdown(
      `Certo. Vou procurar uma forma de te auxiliar ` +
        `e vou notificar o suporte para melhor Ajudá-lo!`
    );

    help.answer = answer;

    SendNotificationService.run({ userFrom, userTo, notificationBody });
  },
  hide: () => help.answer !== null,
});

export default helpNotFound;
