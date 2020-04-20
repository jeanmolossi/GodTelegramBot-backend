import Composer from 'telegraf/composer';

import PromoteCommand from './PromoteCommand';

class CoFounderCommands extends Composer {
  constructor() {
    super();

    this.use(PromoteCommand);
  }
}

export default new CoFounderCommands();
