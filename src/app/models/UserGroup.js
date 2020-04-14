import Sequelize, { Model } from 'sequelize';

export default class UserGroup extends Model {
  static init(sequelize) {
    super.init(
      {
        warnsNumber: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        userRole: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        }
      },
      { sequelize, modelName: 'UserGroup' }
    );
    return this;
  }
}
