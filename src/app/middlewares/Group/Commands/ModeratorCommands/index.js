import Composer from 'telegraf/composer';

import InfoCommand from './InfoCommand';
import MuteCommand from './MuteCommand';

export default class ModeratorCommands extends Composer {
  constructor(database, subject) {
    super();

    this.use(new InfoCommand(database, subject));
    this.use(new MuteCommand(database, subject));
  }
}
