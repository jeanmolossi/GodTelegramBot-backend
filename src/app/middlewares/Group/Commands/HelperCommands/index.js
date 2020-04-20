import Composer from 'telegraf/composer';

import DelCommand from './DelCommand';
import LogDelCommand from './LogDelCommand';

class HelperCommands extends Composer {
  constructor() {
    super();
    this.use(DelCommand);
    this.use(LogDelCommand);
  }
}

export default new HelperCommands();
