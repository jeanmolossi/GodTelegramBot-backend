import Composer from 'telegraf/composer';

import NotificationsCommand from './NotificationsCommand';

export default class ModeratorCommands extends Composer{
  constructor(database){
    super();
    this.use( new NotificationsCommand(database) );
  }
}
