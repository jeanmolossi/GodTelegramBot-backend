import Sequelize from 'sequelize';

import database from '../config/database';

import User from '../app/models/User';
import Group from '../app/models/Group';
import UserGroup from '../app/models/UserGroup';
import Buy from '../app/models/Buy';
import Product from '../app/models/Product';
import Notification from '../app/models/Notification';
import Config from '../app/models/Config';

import UserMethods from './methods/User';
import GroupMethods from './methods/Group';

const models = [User, Group, UserGroup, Buy, Product, Notification, Config];

const needSync = process.env.NEEDSYNC || false;
const needForce = process.env.NEEDFORCE || false;

/**
 * @param { LEVEL }
 * 1 - Default User
 * 2 - Livre
 * 3 - Helper
 * 4 - SubModerador
 * 5 - Moderador
 * 6 - Administrador
 * 7 - SubDono
 * 8 - Dono
 * 99 - DEV
 */

class Database {
  constructor(subject) {
    this.observer = subject;

    this.userMethods = new UserMethods(subject);
    this.groupMethods = new GroupMethods(subject);

    this.levelRole = {
      Default_User: 1,
      Livre: 2,
      Helper: 3,
      SubModerator: 4,
      Moderator: 5,
      Administrator: 6,
      CoFounder: 7,
      Founder: 8,
      Dev: 99,
    };

    this.init();
    return this;
  }

  async init() {
    this.sequelize = new Sequelize(database);

    models.map((model) => model && model.init(this.sequelize));
    models.map(
      (model) => model.associate && model.associate(this.sequelize.models)
    );

    if (needSync) {
      this.sequelize.sync({ force: needForce });
    }
  }
}

export default Database;
