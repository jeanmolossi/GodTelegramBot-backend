import Composer from 'telegraf/composer';

import StartCommand from './StartCommand';
import MyDataCommand from './MyDataCommand';
import GroupLinkCommand from './GroupLinkCommand';
import RegisterCommand from './RegisterCommand';
import MyWarnsCommand from './MyWarnsCommand';
import FaqCommand from './FaqCommand';
import MyProductsCommand from './MyProductsCommand';

export default class MemberCommands extends Composer {
  constructor(database, subject) {
    super();
    this.use(new StartCommand(database, subject));
    this.use(new MyDataCommand(database, subject));
    this.use(new GroupLinkCommand(database, subject));
    this.use(new RegisterCommand(database, subject));
    this.use(new MyWarnsCommand(database, subject));
    this.use(new FaqCommand(database, subject));
    this.use(new MyProductsCommand(database, subject));
  }
}
