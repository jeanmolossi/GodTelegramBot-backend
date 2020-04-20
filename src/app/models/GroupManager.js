import Sequelize, { Model } from 'sequelize';

class GroupManager extends Model {
  static init(connection) {
    super.init(
      {
        newMembers: { type: Sequelize.INTEGER, defaultValue: 0 },
        leftMembers: { type: Sequelize.INTEGER, defaultValue: 0 },
        totalDayMembers: { type: Sequelize.INTEGER, defaultValue: 0 },
        userCount: Sequelize.INTEGER,
      },
      { sequelize: connection }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Group, { foreignKey: 'tgId', as: 'GroupReport' });
  }
}

export default GroupManager;
