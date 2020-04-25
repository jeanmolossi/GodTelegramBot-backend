import Group from '../app/models/Group';
import Product from '../app/models/Product';

class FindGroupProduct {
  async run({ groupTgId }) {
    const product = await Product.findAll({
      include: [{ model: Group, where: { tgId: `${groupTgId}` } }],
    });
    if (product && product.length > 0) {
      return product;
    }
    return null;
  }
}

export default new FindGroupProduct();
