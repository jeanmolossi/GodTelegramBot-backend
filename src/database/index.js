import Sequelize from 'sequelize';

import database from '../config/database';

import Initializer from './methods';

import User from '../app/models/User';
import Group from '../app/models/Group';
import GroupManager from '../app/models/GroupManager';
import UserGroup from '../app/models/UserGroup';
import Buy from '../app/models/Buy';
import Product from '../app/models/Product';
import Notification from '../app/models/Notification';
import Config from '../app/models/Config';
import ParentChildInGroup from '../app/models/ParentChildInGroup';
import Rule from '../app/models/Rule';
import Spam from '../app/models/Spam';

const models = [
  User,
  Group,
  GroupManager,
  UserGroup,
  Buy,
  Product,
  Notification,
  Config,
  ParentChildInGroup,
  Rule,
  Spam,
];

const needSync = process.env.NEEDSYNC || false;
const needForce = process.env.NEEDFORCE || false;

class Database {
  constructor() {
    this.initializer = Initializer;

    this.init();
    return this;
  }

  async init() {
    this.sequelize = new Sequelize(process.env.DATABASE_URL || database);

    models.map((model) => model && model.init(this.sequelize));
    models.map(
      (model) => model.associate && model.associate(this.sequelize.models)
    );

    if (needSync) {
      this.sequelize.sync({ force: needForce });
    }
  }
}

export default new Database();
