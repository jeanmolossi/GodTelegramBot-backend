import TelegrafInlineMenu from 'telegraf-inline-menu';

const moreWarns = new TelegrafInlineMenu(
  'Qual sua dúvida sobre os "Alertas" ?'
);

moreWarns.button('Como sei se possuo alertas ?', 'iHaveWarns', {
  doFunc: async (context) => {
    await context.answerCbQuery('Muito simples essa...');
    await context.replyWithMarkdown(
      `Para saber se você recebeu algum ` +
        `alerta. Volte ao início e toque o botão "Meus alertas"`
    );
  },
  setMenuAfter: () => true,
});
moreWarns.button('O que são esses "Alertas" ?', 'action2', {
  doFunc: async (context) => {
    await context.answerCbQuery('Muito simples essa também...');
    await context.replyWithMarkdown(
      `Os alertas são uma forma de controlar a conduta dos usuários.\n\n` +
        `Usuários que quebram as regras do grupo ou tem um mau comportamento ` +
        `recebem punições que são atribuidas como pontos em alertas\n\n` +
        `A partir do 3 ponto de alerta você é automaticamente banido do grupo`
    );
  },
  setMenuAfter: () => true,
});

moreWarns.button('Que grupos alertam os usuários ?', 'action3', {
  doFunc: async (context) => {
    await context.answerCbQuery('Essa é difícil...');
    await context.replyWithMarkdown(
      `Todos os grupos em que seus administradores ativam a opção de alertas ou ` +
        `em que os próprios administradores alertam manualmente seus usuários!\n` +
        `Recomendo apenas que comporte-se e não terá problemas =D`
    );
  },
  setMenuAfter: () => true,
});

export default moreWarns;
