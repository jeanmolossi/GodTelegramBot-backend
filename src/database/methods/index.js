import UserMethods from './User';
import GroupMethods from './Group';
import ProductMethods from './Product';
import ConfigMethods from './Config';
import RuleMethods from './Rule';
import SpamMethods from './Spam';

class Initializer {
  constructor() {
    this.run = {
      UserMethods,
      GroupMethods,
      ProductMethods,
      ConfigMethods,
      RuleMethods,
      SpamMethods,
    };
    return this;
  }
}

export default new Initializer();
