import User from '../app/models/User';
import Product from '../app/models/Product';
import Buy from '../app/models/Buy';

class ProducerByBuyService {
  async run({ sellCode }) {
    const buySearch = await Buy.findOne({
      where: { sellCode },
      include: [
        {
          model: Product,
          include: [{ model: User }],
        },
      ],
    });
    if (buySearch && buySearch.Product) {
      const product = buySearch.Product;
      if (product && product.User) {
        return {
          Buy: buySearch.dataValues,
          Product: product.dataValues,
          User: product.User.dataValues,
        };
      }

      return {
        Buy: buySearch.dataValues,
        Product: product.dataValues,
        User: null,
      };
    }

    return {
      Buy: null,
      Product: null,
      User: null,
    };
  }
}

export default new ProducerByBuyService();
