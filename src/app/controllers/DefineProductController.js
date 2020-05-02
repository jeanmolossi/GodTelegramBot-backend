import Product from '../models/Product';
import Group from '../models/Group';

class DefineProductController {
  async update(req, res) {
    const { sync, groupPk, productPk } = req.body;

    const groupToSync = await Group.findByPk(groupPk);
    const productToSync = await Product.findByPk(productPk);

    if (sync) {
      const response = await productToSync.addGroup(groupToSync);
      return res.json(response);
    }

    const response = await productToSync.removeGroup(groupToSync);
    return res.json(response);
  }
}

export default new DefineProductController();
