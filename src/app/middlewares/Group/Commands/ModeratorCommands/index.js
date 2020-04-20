import Composer from 'telegraf/composer';

import InfoCommand from './InfoCommand';
import MuteCommand from './MuteCommand';

class ModeratorCommands extends Composer {
  constructor() {
    super();

    this.use(InfoCommand);
    this.use(MuteCommand);
  }
}

export default new ModeratorCommands();
