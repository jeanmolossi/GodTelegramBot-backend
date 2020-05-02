import Product from '../models/Product';
import User from '../models/User';
import Group from '../models/Group';

class MultipleProductController {
  async index(req, res) {
    const userProducts = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Product,
          where: { productActive: true },
          attributes: [
            'id',
            'productName',
            'productId',
            'productActive',
            'productMonetizze',
            'createdAt',
          ],
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Group,
            },
          ],
        },
      ],
    });
    const product = userProducts.Products;
    if (!(userProducts && userProducts.Products))
      return res.status(400).json({ error: 'Products not Found!' });

    return res.json(product);
  }
}

export default new MultipleProductController();
