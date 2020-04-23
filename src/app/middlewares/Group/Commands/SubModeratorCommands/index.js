import Composer from 'telegraf/composer';

import WarnCommand from './WarnCommand';
import UnwarnCommand from './UnwarnCommand';

class SubModeratorCommands extends Composer {
  constructor() {
    super();

    this.use(WarnCommand);
    this.use(UnwarnCommand);
  }
}

export default new SubModeratorCommands();
