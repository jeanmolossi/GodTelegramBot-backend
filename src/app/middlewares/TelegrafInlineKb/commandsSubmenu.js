import TelegrafInlineMenu from 'telegraf-inline-menu';

const commandsSubmenu = new TelegrafInlineMenu('Não há muitos comandos.');

commandsSubmenu.button('/start', 'startCommand', {
  doFunc: () => {},
  setParentMenuAfter: () => true,
});

commandsSubmenu.button('/help', 'helpCommand', {
  doFunc: () => {},
  setParentMenuAfter: () => true,
});

export default commandsSubmenu;
