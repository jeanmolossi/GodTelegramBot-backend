import TelegrafInlineMenu from 'telegraf-inline-menu';

import registerSubmenu from './registerSubmenu';
import commandsSubmenu from './commandsSubmenu';
import groupsSubmenu from './groupsSubmenu';
import mybuysSubmenu from './mybuysSubmenu';
import myWarnsSubmenu from './myWarnsSubmenu';
import faqAndHelpSubmenu from './faqAndHelpSubmenu';

const startMenu = new TelegrafInlineMenu(
  (context) =>
    `Opa, tudo bem, ${context.from.first_name}! Fico feliz em falar com você! ` +
    `Do que você precisa?`
);
startMenu.setCommand('start');

startMenu.submenu('Me registrar', 'register', registerSubmenu);
startMenu.submenu('Meus comandos', 'myCommands', commandsSubmenu);
startMenu.submenu('Meus grupos', 'myGroups', groupsSubmenu);
startMenu.submenu('Minhas compras', 'mybuyssub', mybuysSubmenu);
startMenu.submenu('Meus alertas', 'mywarnssub', myWarnsSubmenu);
startMenu.submenu('Perguntas frequentes e Ajuda', 'faqHelp', faqAndHelpSubmenu);

export default startMenu.init({
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar ao início',
});
