import TelegrafInlineMenu from 'telegraf-inline-menu';

const moreGroups = new TelegrafInlineMenu('Qual sua dúvida sobre os grupos?');

moreGroups.button('Como consigo acesso aos grupos?', 'howGetAcess', {
  doFunc: async (context) => {
    await context.answerCbQuery('Facilitando seu acesso aos grupos...');
    await context.reply(
      `Para conseguir o acesso para seus grupos, Volte ao início e\n` +
        `Pressione o botão "Meus grupos > Receber link dos grupos"`
    );
  },
  setParentMenuAfter: () => true,
});

moreGroups.button('Meus Botões de acesso não funcionam?', 'brokenLinks', {
  doFunc: async (context) => {
    await context.answerCbQuery('Buscando soluções...');
    await context.reply(
      `Seus botões de link podem não estar funcionando ` +
        `por diversos motivos, entre eles: \n\n` +
        `1 - Você foi banido do grupo\n2 - O grupo não está mais ativo\n3 - ` +
        `Houve um erro com o telegram.\n4 - Você não está com cadastro ativo.\n\n` +
        `De toda forma, vou notificar o Staff.\nAguarde cerca de 5 minutos e ` +
        `tente acessar o botão outra vez.`
    );
  },
  setParentMenuAfter: () => true,
});

moreGroups.button('Meus grupos não aparecem', 'missingGroups', {
  doFunc: async (context) => {
    await context.answerCbQuery('Acredito que têm algo errado...');
    await context.reply(
      `Para seus grupos não estarem aparecendo, ` +
        `provavelmente, seu registro não está ativo.\n\n` +
        `Caso acredite que ocorreu algum erro. Acesse o seu menu "Minhas compras" ` +
        `no Início. Verifique se você recebeu corretamente os dados da compra.\n\n` +
        `Caso os dados estejam incorretos, volte ao início e refaça seu registro.`
    );
  },
  setParentMenuAfter: () => true,
});

export default moreGroups;
