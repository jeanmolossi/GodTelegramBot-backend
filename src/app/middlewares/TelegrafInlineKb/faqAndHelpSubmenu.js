import TelegrafInlineMenu from 'telegraf-inline-menu';

import moreRegister from './moreRegister';
import moreCommands from './moreCommands';
import moreGroups from './moreGroups';
import moreBuys from './moreBuys';
import moreWarns from './moreWarns';

const faqAndHelpSubmenu = new TelegrafInlineMenu(
  `Abaixo estão as dúvidas mais frequentes de nossos usuários\n` +
    `Sobre o que você deseja saber mais?`
);

const help = {
  answer: null,
};

function changeTextForHelp() {
  if (help.answer === null) {
    return `Envie sua dúvida, toque o botão abaixo e digite em 1 mensagem apenas toda sua dúvida.`;
  }
  return `Sua dúvida foi enviada,  aguarde...`;
}

const helpNotFound = new TelegrafInlineMenu(changeTextForHelp);

faqAndHelpSubmenu.submenu('Sobre o registro', 'moreRegister', moreRegister);
faqAndHelpSubmenu.submenu('Sobre os comandos', 'moreCommands', moreCommands);
faqAndHelpSubmenu.submenu('Sobre os Grupos', 'moreGroups', moreGroups);
faqAndHelpSubmenu.submenu('Sobre minhas compras', 'moreBuys', moreBuys);
faqAndHelpSubmenu.submenu('Sobre os Alertas', 'moreWarns', moreWarns);
faqAndHelpSubmenu.submenu(
  'Não achei minha dúvida...',
  'helpNotFound',
  helpNotFound
);

helpNotFound.question('Me ajude', 'helpMe', {
  uniqueIdentifier: Math.floor(Math.random() * 15000).toString(),
  questionText: 'Como posso te ajudar ?',
  setFunc: async (context, answer) => {
    await context.replyWithMarkdown(
      `Certo. Vou procurar uma forma de te auxiliar.` +
        `Farei meu melhor e em últimos casos vou notificar a Staff do seu produto!`
    );
    help.answer = answer;
    // console.log(answer);
  },
  hide: () => help.answer !== null,
});

export default faqAndHelpSubmenu;
