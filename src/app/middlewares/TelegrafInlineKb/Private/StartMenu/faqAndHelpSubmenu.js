import TelegrafInlineMenu from 'telegraf-inline-menu';

import moreRegister from './moreRegister';
import moreCommands from './moreCommands';
import moreGroups from './moreGroups';
import moreBuys from './moreBuys';
import moreWarns from './moreWarns';
import helpNotFound from './helpNotFound';

const faqAndHelpSubmenu = new TelegrafInlineMenu(
  `Abaixo estão as dúvidas mais frequentes de nossos usuários\n` +
    `Sobre o que você deseja saber mais?`
);

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

export default faqAndHelpSubmenu;
