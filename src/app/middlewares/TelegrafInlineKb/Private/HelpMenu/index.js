import TelegrafInlineMenu from 'telegraf-inline-menu';

import myCommandsByGroup from './myCommandsByGroup';
// import commandsSubmenu from './commandsSubmenu';
// import groupsSubmenu from './groupsSubmenu';
// import mybuysSubmenu from './mybuysSubmenu';
// import myWarnsSubmenu from './myWarnsSubmenu';
import faqAndHelpSubmenu from '../StartMenu/faqAndHelpSubmenu';

const helpMenu = new TelegrafInlineMenu(
  context =>
    `Opa, tudo bem, ${context.from.first_name}! Fico feliz em falar com você! ` +
    `Do que você precisa?`
);

helpMenu.setCommand('help');

helpMenu.submenu('Meus comandos nos grupos', 'cbg', myCommandsByGroup);

helpMenu.submenu(
  'Perguntas e frequentes e Ajuda',
  'faqHelp',
  faqAndHelpSubmenu
);

export default helpMenu.init({
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar pro início',
  actionCode: 'h',
});
