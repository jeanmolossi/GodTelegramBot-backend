import Sequelize, { Model } from 'sequelize';

class ParentChildInGroup extends Model {
  static init(sequelize) {
    super.init(
      {
        parentTgId: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        childTgId: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        groupTgId: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
      },
      { sequelize }
    );
    this.removeAttribute('id');
    return this;
  }
}

export default ParentChildInGroup;
