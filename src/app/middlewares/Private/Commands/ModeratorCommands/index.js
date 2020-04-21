import Composer from 'telegraf/composer';

import NotificationCommand from './NotificationCommand';

class ModeratorCommands extends Composer {
  constructor() {
    super();
    this.use(NotificationCommand);
  }
}

export default new ModeratorCommands();
