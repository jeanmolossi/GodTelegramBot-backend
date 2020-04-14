import Sequelize, { Model } from 'sequelize';

class Group extends Model {
  static init(connection) {
    super.init(
      {
        tgId: { type: Sequelize.STRING, unique: true },
        oldTgId: Sequelize.STRING,
        name: Sequelize.STRING,
        productId: Sequelize.STRING,
        userCount: { type: Sequelize.INTEGER, defaultValue: 1 },
      },
      { sequelize: connection }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.User, { through: models.UserGroup });
  }

  static async findOrCreateByTgId(tgId) {
    const [group] = await this.findOrCreate({
      where: { tgId: `${tgId}` },
    });
    return group;
  }

  static async findByTgId(tgId) {
    const group = await this.findOne({
      where: { tgId: `${tgId}` },
    });
    if (!group) return false;

    return group;
  }
}

export default Group;
