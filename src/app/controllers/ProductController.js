import * as yup from 'yup';

import { isProduct } from '../../Utils/monetizzeUtils';

import Product from '../models/Product';
import User from '../models/User';
import Config from '../models/Config';

class ProductController {
  async index(req, res) {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id, productActive: true },
      attributes: [
        'productName',
        'productActive',
        'productId',
        'productMonetizze',
      ],
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });
    if (!(product && product.User && product.User.id === req.userId))
      return res.status(400).json({ error: 'Product not Found!' });

    return res.json(product);
  }

  async store(req, res) {
    const validSchema = yup.object().shape({
      productId: yup.number().required(),
      isMonetizze: yup.boolean().required(),
    });
    if (!(await validSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Identifier product is missing' });

    const { productId, isMonetizze: productMonetizze } = req.body;

    const productExists = await Product.findOne({
      where: { productId: productId.toString() },
    });
    if (productExists && productExists.productActive === true)
      return res.json({ error: 'That product is already exists' });

    const userConfig = await User.findByPk(req.userId, {
      attributes: ['id', 'ConfigId'],
      include: [{ model: Config, attributes: ['id', 'consumerKey'] }],
    });

    if (productMonetizze && userConfig.ConfigId === null) {
      return res.status(400).json({
        error:
          'To connect in API, you must provide a Consumer Key in your configs',
      });
    }
    let productInfo;
    if (productMonetizze) {
      productInfo = await isProduct(productId, userConfig.Config.consumerKey);
    } else {
      productInfo = { nome: 'Nome provisório' };
    }
    let newProduct = null;

    if (productExists && productExists.productActive === false) {
      newProduct = await Product.findOne({
        where: { productId: productId.toString() },
      });
      await newProduct.update({ productActive: true });
      await userConfig.addProduct(newProduct);
      await newProduct.setUser(req.userId);
      return res.json(newProduct);
    }

    newProduct = await Product.create({
      productId: productId.toString(),
      productName: productInfo.nome,
    });
    await userConfig.addProduct(newProduct);
    await newProduct.setUser(req.userId);

    return res.json(newProduct);
  }

  async update(req, res) {
    const validSchema = yup.object().shape({
      productName: yup.string().required(),
    });
    if (!(await validSchema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid request to Update' });

    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product || product.UserId !== req.userId)
      return res.status(400).json({ error: 'Product not found' });

    const { productName } = req.body;
    await product.update({ productName });
    await product.setUser(req.userId);

    return res.json({ productName });
  }

  async delete(req, res) {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product || product.UserId !== req.userId)
      return res.status(400).json({ error: 'Product not found' });

    await product.update({ productActive: false });

    return res.json({ deleted: true });
  }
}

export default new ProductController();
