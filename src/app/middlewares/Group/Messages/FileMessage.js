import Composer from 'telegraf';

export default class FileMessage extends Composer {
  constructor(database) {
    super();

    this.database = database;
    this.use(this.messageFilter.bind(this));
  }

  async messageFilter(context, next) {}
}
