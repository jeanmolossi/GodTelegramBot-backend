import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

import Config from './Config';
import Product from './Product';

class User extends Model {
  static init(connection) {
    super.init(
      {
        // PANEL INFO
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        level: { type: Sequelize.INTEGER, defaultValue: 1 },
        canLogin: { type: Sequelize.BOOLEAN, defaultValue: false },
        // MONETIZZE INFO
        consumerKey: Sequelize.STRING,
        // TELEGRAM INFO
        tgId: { type: Sequelize.STRING, unique: true },
        tgPic: Sequelize.STRING,
      },
      { sequelize: connection }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Group, { through: models.UserGroup });
    this.belongsToMany(models.Buy, { through: 'UserBuys' });
    this.belongsToMany(models.Product, { through: 'UserProduct' });
    this.belongsTo(models.Config, { through: 'UserConfig' });
  }

  static async findOrCreateByTgId(tgId) {
    const [user] = await this.findOrCreate({
      where: { tgId: `${tgId}` },
      include: [
        {
          model: Config,
        },
        {
          model: Product,
        },
      ],
    });
    return user;
  }

  static async findByTgId(tgId) {
    const user = await this.findOne({
      where: { tgId: `${tgId}` },
    });
    return user;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  canLogin() {
    return this.canLogin;
  }

  userConsumerKey() {
    return this.consumerKey;
  }

  userLevel() {
    return this.level;
  }
}

export default User;
