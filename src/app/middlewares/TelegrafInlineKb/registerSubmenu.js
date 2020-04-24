import TelegrafInlineMenu from 'telegraf-inline-menu';

const registerSubmenu = new TelegrafInlineMenu(
  'Comece seu registro, escolha abaixo o campo e responda a pergunta.\n' +
    'É importante lembrar de enviar todos os dados!'
);

const dados = {
  email: null,
  vendacodigo: null,
  productId: null,
};
let registroCompleto = true;
let counter = Object.keys(dados).length;

function downCounter(value = null) {
  if (value !== null) {
    counter -= 1;
  }
  if (counter <= 0) {
    registroCompleto = false;
  }
}

registerSubmenu.question(`Enviar e-mail`, 'addEmail', {
  uniqueIdentifier: '123',
  questionText: 'Qual o e-mail de compra ?',
  setFunc: (_ctx, answer) => {
    dados.email = answer;
    downCounter(dados.email);
  },
  hide: () => dados.email !== null,
});

registerSubmenu.question('Enviar código da transação', 'addSellCode', {
  uniqueIdentifier: '124',
  questionText: 'Qual o código da transação ?',
  setFunc: (_ctx, answer) => {
    dados.vendacodigo = answer;
    downCounter(dados.vendacodigo);
  },
  hide: () => dados.vendacodigo !== null,
});

registerSubmenu.question('Enviar código do produto', 'addProductId', {
  uniqueIdentifier: '125',
  questionText: 'Qual o código do produto ?',
  setFunc: (_ctx, answer) => {
    dados.productId = answer;
    downCounter(dados.productId);
  },
  hide: () => dados.productId !== null,
});

registerSubmenu.button('Digitei errado... recomeçar', 'register', {
  doFunc: () => {
    dados.email = null;
    dados.vendacodigo = null;
    dados.productId = null;
  },
  hide: () =>
    dados.email === null &&
    dados.vendacodigo === null &&
    dados.productId === null,
  setMenuAfter: () => true,
});

registerSubmenu.button('Completar registro', 'registerComplete', {
  doFunc: async (ctx) => {
    await ctx.answerCbQuery('Completando registro...');
    await ctx.reply(
      `Seus dados foram enviados:\n\nE-mail: ${dados.email}\n` +
        `Transação: ${dados.vendacodigo}\nCódigo do produto: ${dados.productId}`
    );
  },
  hide: () => registroCompleto,
  setParentMenuAfter: () => true,
});

export default registerSubmenu;
