import Sequelize, { Model } from 'sequelize';

import { addMonths, parseISO, format } from 'date-fns';

class Buy extends Model {
  static init(sequelize) {
    super.init(
      {
        sellCode: { type: Sequelize.STRING, unique: true },
        sellStatus: Sequelize.STRING,
        signCode: Sequelize.STRING,
        signStatus: Sequelize.STRING,
        signDate: Sequelize.DATE,
        signType: Sequelize.STRING,
        signPlanPeriod: Sequelize.STRING,
        signUntil: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', (buy) => {
      const plans = [
        'Mensal',
        'Bimestral',
        'Trimestral',
        'Semestral',
        'Anual',
        'Trienal',
      ];
      const monthsToAddByPlan = [1, 2, 3, 6, 12, 36];
      const selector = plans.indexOf(buy.signPlanPeriod);
      const monthstoAdd = monthsToAddByPlan[selector];
      const formatDate = parseISO(
        format(addMonths(buy.signDate, monthstoAdd), "yyyy-MM-dd'T'HH:mm:ssxxx")
      );
      buy.signUntil = formatDate;
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { through: 'UserBuys' });
    this.belongsTo(models.Product, { through: 'ProductBuys' });
  }
}

export default Buy;
