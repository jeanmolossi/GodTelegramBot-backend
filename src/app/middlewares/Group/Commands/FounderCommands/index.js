import Composer from 'telegraf/composer';

import PromoteCommand from './PromoteCommand';

export default class FounderCommands extends Composer {
  constructor(database, subject) {
    super();

    this.use(new PromoteCommand(database, subject));
  }
}
