import Composer from 'telegraf/composer';
import StartMenu from './StartMenu';

class MenuInitializer extends Composer {
  constructor() {
    super();

    this.use(StartMenu);
    return this;
  }
}

export default new MenuInitializer();
