import Composer from 'telegraf/composer';

import SettingsCommand from './SettingsCommand';
import ReloadCommand from './ReloadCommand';
import BanCommand from './BanCommand';
import UnbanCommand from './UnbanCommand';
import KickCommand from './KickCommand';

export default class AdministratorCommands extends Composer{
  constructor(database){
    super();
    this.use( new SettingsCommand(database) );
    this.use( new ReloadCommand(database) );
    this.use( new BanCommand(database) );
    this.use( new UnbanCommand(database) );
    this.use( new KickCommand(database) );
  }
}
