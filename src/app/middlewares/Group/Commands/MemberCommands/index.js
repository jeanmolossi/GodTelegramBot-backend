import Composer from 'telegraf/composer';

import StartCommand from './StartCommand';
import HelpCommand from './HelpCommand';
import StaffCommand from './StaffCommand';

export default class MemberCommands extends Composer {
  constructor(database) {
    super();
    this.use(new StartCommand(database));
    this.use(new HelpCommand(database));
    this.use(new StaffCommand(database));
  }
}
