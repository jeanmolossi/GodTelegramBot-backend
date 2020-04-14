import Composer from 'telegraf/composer';

import DelCommand from './DelCommand';
import LogDelCommand from './LogDelCommand';

export default class HelperCommands extends Composer {
  constructor(database) {
    super();
    this.use(new DelCommand(database));
    this.use(new LogDelCommand(database));
  }
}
