import TelegrafInlineMenu from 'telegraf-inline-menu';

import rulesConfigSubmenu from './rulesConfig';
import defineProduct from './defineProduct';

const SettingsMenu = new TelegrafInlineMenu(
  `Menu de configurações de grupo\n` +
    `Você pode também efetuar algumas alterações direto no painel Online`
);

SettingsMenu.setCommand('settings');

SettingsMenu.submenu(
  'Ativar / Desativar regras',
  'rulesConfig',
  rulesConfigSubmenu
);

SettingsMenu.submenu('Sincronizar produto', 'defineProduct', defineProduct);

export default SettingsMenu.init({
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar ao início',
});
