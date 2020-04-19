import Composer from 'telegraf/composer';

import SettingsCommand from './SettingsCommand';
import ReloadCommand from './ReloadCommand';
import BanCommand from './BanCommand';
import UnbanCommand from './UnbanCommand';
import KickCommand from './KickCommand';
import PromoteCommand from './PromoteCommand';

export default class AdministratorCommands extends Composer {
  constructor(database, subject) {
    super();
    this.use(new SettingsCommand(database, subject));
    this.use(new ReloadCommand(database, subject));
    this.use(new BanCommand(database, subject));
    this.use(new UnbanCommand(database, subject));
    this.use(new KickCommand(database, subject));
    this.use(new PromoteCommand(database, subject));
  }
}
