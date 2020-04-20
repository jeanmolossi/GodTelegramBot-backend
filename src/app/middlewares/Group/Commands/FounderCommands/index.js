import Composer from 'telegraf/composer';

import PromoteCommand from './PromoteCommand';

class FounderCommands extends Composer {
  constructor() {
    super();

    this.use(PromoteCommand);
  }
}

export default new FounderCommands();
