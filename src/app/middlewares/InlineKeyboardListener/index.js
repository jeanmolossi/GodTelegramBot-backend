import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

import EventEmitter from '../../../store/EventEmitter';

import UserLevelByGroupService from '../../../services/UserLevelByGroupService';

import FaqListener from './Listeners/FaqListener';
import RegisterListener from './Listeners/RegisterListener';
import CommandsListener from './Listeners/CommandsListener';
import GroupsListener from './Listeners/GroupsListener';
import BuysListener from './Listeners/BuysListener';
import WarnsListener from './Listeners/WarnsListener';

import SettingsListener from './Listeners/SettingsListener';

import HelperListener from './SubListeners/HelperListener';
import SubModeratorListener from './SubListeners/SubModeratorListener';
import ModeratorListener from './SubListeners/ModeratorListener';
import AdministratorListener from './SubListeners/AdministratorListener';

class InlineKeyboardListener extends Composer {
  constructor() {
    super();
    this.subject = EventEmitter;

    this.use(Composer.acl(this.userLevel.bind(this), SettingsListener));

    this.use(FaqListener);
    this.use(RegisterListener);
    this.use(CommandsListener);
    this.use(GroupsListener);
    this.use(BuysListener);
    this.use(WarnsListener);

    // HERE ARE THE SUBLISTNERS
    this.use(HelperListener);
    this.use(SubModeratorListener);
    this.use(ModeratorListener);
    this.use(AdministratorListener);

    this.action('firstMenuStartAction', this.firstMenuStartAction.bind(this));
  }

  async firstMenuStartAction(context, next) {
    try {
      await context.answerCbQuery();
      await context.editMessageText(
        `Opa, tudo bem! Fico feliz em falar com você!\nDo que você precisa?`,
        Extra.markup((m) =>
          m.inlineKeyboard([
            [m.callbackButton('Me registrar', 'register')],
            [m.callbackButton('Meus comandos', 'myCommands')],
            [m.callbackButton('Meus grupos', 'myGroups')],
            [m.callbackButton('Minhas compras', 'myBuys')],
            [m.callbackButton('Meus alertas', 'myWarns')],
            [m.callbackButton('Perguntas frequentes e Ajuda', 'faq')],
          ])
        )
      );
      return next();
    } catch (error) {
      return next();
    }
  }

  async userLevel(context, next) {
    try {
      const serviceRunner = await UserLevelByGroupService.run({ context });
      return serviceRunner;
    } catch (error) {
      return false;
    }
  }
}

export default new InlineKeyboardListener();
