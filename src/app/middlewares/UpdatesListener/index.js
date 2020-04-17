import Composer from 'telegraf/composer';
import Extra from 'telegraf/extra';

import FaqListener from './Listeners/FaqListener';
import RegisterListener from './Listeners/RegisterListener';
import CommandsListener from './Listeners/CommandsListener';
import GroupsListener from './Listeners/GroupsListener';
import BuysListener from './Listeners/BuysListener';
import WarnsListener from './Listeners/WarnsListener';

import HelperListener from './SubListeners/HelperListener';
import SubModeratorListener from './SubListeners/SubModeratorListener';
import ModeratorListener from './SubListeners/ModeratorListener';
import AdministratorListener from './SubListeners/AdministratorListener';

export default class UpdateListener extends Composer {
  constructor(database, subject) {
    super();
    this.subject = subject;
    this.database = database;

    this.use(new FaqListener(subject));
    this.use(new RegisterListener(subject));
    this.use(new CommandsListener(subject));
    this.use(new GroupsListener(database, subject));
    this.use(new BuysListener(database, subject));
    this.use(new WarnsListener(database, subject));

    this.use(new HelperListener(subject));
    this.use(new SubModeratorListener(subject));
    this.use(new ModeratorListener(subject));
    this.use(new AdministratorListener(subject));

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
}
