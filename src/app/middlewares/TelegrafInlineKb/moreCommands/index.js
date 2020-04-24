import TelegrafInlineMenu from 'telegraf-inline-menu';

const moreCommands = new TelegrafInlineMenu(
  'Qual sua dúvida sobre os comandos ?'
);

moreCommands.button('Por que tão poucos comandos?', 'whyBoredCommands', {
  doFunc: async (context) => {
    await context.answerCbQuery('Respondendo à sua dúvida...');
    await context.reply(
      `Você pode usar somente alguns comandos.\n` +
        `Porém, dependendo de sua posição no grupo serão habilitados alguns ` +
        `comandos a mais para você usar. Para saber quais são, use /help no ` +
        `grupo ao qual deseja saber.\n\nEsses comandos só ficarão habilitados ` +
        `nos grupos específicos em que você tenha autorização para utilizá-los`
    );
  },
  setParentMenuAfter: () => true,
});

export default moreCommands;
