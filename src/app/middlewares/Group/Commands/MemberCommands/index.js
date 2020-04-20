import Composer from 'telegraf/composer';

import StartCommand from './StartCommand';
import HelpCommand from './HelpCommand';
import StaffCommand from './StaffCommand';
import InitCommand from './InitCommand';

class MemberCommands extends Composer {
  constructor() {
    super();
    this.use(StartCommand);
    this.use(HelpCommand);
    this.use(StaffCommand);
    this.use(InitCommand);
  }
}

export default new MemberCommands();
