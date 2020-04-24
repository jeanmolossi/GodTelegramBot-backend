import TelegrafInlineMenu from 'telegraf-inline-menu';
import Extra from 'telegraf/extra';

const moreRegister = new TelegrafInlineMenu(
  'Qual sua dúvida sobre o Registro ?'
);

const essentialData = {
  findProductCodeUrl: 'https://app.monetizze.com.br/loja',
};

moreRegister.button('O que é o registro ?', 'whatIsRegister', {
  doFunc: async (_ctx) => {
    await _ctx.answerCbQuery('Explicando o que é o registro...');
    await _ctx.reply(
      `É o registro necessário para que eu possa sincronizar sua conta ` +
        `com a sua compra. Dessa forma eu posso agilizar MUITO! seu atendimento\n` +
        `Assim você não fica esperando e consegue acesso, quase que imediato ao seu produto`
    );
  },
});

moreRegister.button('Como faço o registro ?', 'howIRegister', {
  doFunc: async (_ctx) => {
    await _ctx.answerCbQuery('Explicando como você pode fazer o registro...');
    await _ctx.reply(
      `Certo, para registrar-se leia com atenção abaixo\n\n` +
        `Primeiro, tenha em mãos todos seus dados de\n\n` +
        `E-mail de compra,\nCódigo de compra e\nCódigo do produto\n\n` +
        `Após ter esses dados em mãos preciso que acesse o menu "Me registrar"\n` +
        `Em seguida, preencha os dados que aparecerem. Para fazer isso basta tocar no botão e reponder à pergunta\n` +
        `\nAssim que finalizar o processe de preencher irá aparecer o botão "Completar registro"\n` +
        `Basta tocar este botão e aguardar que irei enviar seus dados para registro.` +
        `\n\nPara encontrar o código do produto acesse pelo botão abaixo e busque pelo seu ` +
        `produto comprado.\nEm seguida acesse "Ver detalhes"\nE na descrição do produto encontre "Código do produto"`,
      Extra.markup((m) =>
        m.inlineKeyboard([
          m.urlButton(
            'Onde conseguir o código do produto?',
            `${essentialData.findProductCodeUrl}`
          ),
        ])
      )
    );
  },
});

export default moreRegister;
