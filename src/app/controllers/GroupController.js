import * as yup from 'yup';

import Product from '../models/Product';
import Group from '../models/Group';
import User from '../models/User';

class GroupController {
  async index(req, res) {
    const myProfile = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: Group,
          attributes: ['id', 'tgId', 'oldTgId', 'name', 'userCount'],
        },
      ],
    });
    if (!(myProfile && myProfile.Groups))
      return res.status(400).json({ error: 'Groups not found' });

    const { Groups } = myProfile;

    return res.json(Groups);
  }

  async update(req, res) {
    const schema = yup.object().shape({
      productId: yup.number().required(),
    });
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Invalid request data' });

    const { id } = req.params;
    const { productId } = req.body;

    const group = await Group.findByPk(id);
    if (!group) return res.status(400).json({ error: 'Group not found' });

    const productToSync = await Product.findOne({
      where: { productId, productActive: true, UserId: req.userId },
    });
    if (!productToSync)
      return res.status(400).json({ error: 'Product not found to Sync' });

    await group.update({ productId });
    await productToSync.addGroup(group);

    const { name, userCount } = group;

    return res.json({
      group: {
        name,
        productSync: productToSync.productName,
        userCount,
      },
      product: {
        name: productToSync.productName,
        productId,
      },
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const group = await Group.findByPk(id);
    if (!group) return res.status(400).json({ error: 'Group not found!' });

    await group.destroy();
    return res.json({ group: 'deleted' });
  }
}

export default new GroupController();
