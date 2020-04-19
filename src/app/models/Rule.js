import Sequelize, { Model } from 'sequelize';

class Rule extends Model {
  static init(sequelize) {
    super.init(
      {
        type: {
          type: Sequelize.STRING,
          unique: true,
        },
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Group, { through: 'RulesGroup' });
  }

  static async findByType(type) {
    const rule = await this.findOne({
      where: { type },
    });
    return rule;
  }
}

export default Rule;
