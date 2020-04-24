import TelegrafInlineMenu from 'telegraf-inline-menu';

const moreBuys = new TelegrafInlineMenu(
  'Qual sua dúvida sobre o menu "Minhas compras" ?'
);

moreBuys.button('O que é o "Minhas compras" ?', 'moreOfBuys', {
  doFunc: async (context) => {
    await context.answerCbQuery('São suas compras...');
    await context.reply(
      `É um botão reservado à listagem de suas compras sincronizadas ` +
        `com o meu sistema.\n\nCaso você acesse e não haja nenhuma compra na lista ` +
        `significa que você não sincronizou nenhuma compra.`
    );
  },
  setParentMenuAfter: () => true,
});

moreBuys.button('Para que devo sincronizar minha compra ?', 'whySync', {
  doFunc: async (context) => {
    await context.answerCbQuery('Pra melhorar sua experiência de cliente...');
    await context.replyWithMarkdown(
      `É *altamente* recomendado que sincronize. Há muitos produtores de conteúdo ` +
        `que usam grupos do telegram para distribuição de conteúdo. Porém, muitos ` +
        `desses grupos são privados aos clientes com suas compras sincronizadas.\n\n` +
        `Ao sincronizar sua conta, consigo buscar imediatamente os grupos para você.\n\n` +
        `Dessa forma, você tem acesso imediato ao grupo que você pertence!\n\n` +
        `_Portanto, volte ao ínicio e faça seu registro!_`
    );
  },
  setParentMenuAfter: () => true,
});

moreBuys.button('É seguro sincronizar minha conta ?', 'isSyncSecure', {
  doFunc: async (context) => {
    await context.answerCbQuery('Possuo todos os certificados de segurança');
    await context.replyWithMarkdown(
      `Sim, sua sincronização é totalmente segura. Possuo encriptação de dados ` +
        `para que você e *somente você* tenha acesso aos seus dados.\n` +
        `Preciso da sincronização para me comunicar com os seridores da Monetizze apenas.\n\n` +
        `Assim consigo melhorar e agilizar sua experiência de compra mantendo a segurança de dados!`
    );
  },
  setParentMenuAfter: () => true,
});

export default moreBuys;
