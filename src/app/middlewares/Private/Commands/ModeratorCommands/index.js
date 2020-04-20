import Composer from 'telegraf/composer';

import NotificationsCommand from './NotificationsCommand';

class ModeratorCommands extends Composer {
  constructor() {
    super();
    this.use(NotificationsCommand);
  }
}

export default new ModeratorCommands();
