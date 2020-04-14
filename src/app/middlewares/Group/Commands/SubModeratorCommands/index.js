import Composer from 'telegraf/composer';

import WarnCommand from './WarnCommand';
import UnwarnCommand from './UnwarnCommand';

export default class SubModeratorCommands extends Composer{
  constructor(database){
    super();

    this.use(new WarnCommand(database));
    this.use(new UnwarnCommand(database));
  }
}
