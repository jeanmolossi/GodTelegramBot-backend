import Sequelize, { Model } from 'sequelize';

export default class Config extends Model {
  static init(sequelize) {
    super.init(
      {
        consumerKey: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    // this.belongsTo(models.User, { through: 'UserConfig' });
  }
}
