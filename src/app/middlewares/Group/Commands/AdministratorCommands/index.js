import Composer from 'telegraf/composer';

import SettingsCommand from './SettingsCommand';
import ReloadCommand from './ReloadCommand';
import BanCommand from './BanCommand';
import UnbanCommand from './UnbanCommand';
import KickCommand from './KickCommand';
import PromoteCommand from './PromoteCommand';

class AdministratorCommands extends Composer {
  constructor() {
    super();
    // this.use(SettingsCommand);
    this.use(ReloadCommand);
    this.use(BanCommand);
    this.use(UnbanCommand);
    this.use(KickCommand);
    this.use(PromoteCommand);
  }
}

export default new AdministratorCommands();
