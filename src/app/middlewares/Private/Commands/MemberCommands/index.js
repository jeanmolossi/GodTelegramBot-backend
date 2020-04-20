import Composer from 'telegraf/composer';

import StartCommand from './StartCommand';
import MyDataCommand from './MyDataCommand';
import GroupLinkCommand from './GroupLinkCommand';
import RegisterCommand from './RegisterCommand';
import MyWarnsCommand from './MyWarnsCommand';
import FaqCommand from './FaqCommand';
import MyProductsCommand from './MyProductsCommand';

class MemberCommands extends Composer {
  constructor() {
    super();
    this.use(StartCommand);
    this.use(MyDataCommand);
    this.use(GroupLinkCommand);
    this.use(RegisterCommand);
    this.use(MyWarnsCommand);
    this.use(FaqCommand);
    this.use(MyProductsCommand);
  }
}

export default new MemberCommands();
