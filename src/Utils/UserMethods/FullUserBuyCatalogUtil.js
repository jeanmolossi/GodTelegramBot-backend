import User from '../../app/models/User';
import Buy from '../../app/models/Buy';
import Product from '../../app/models/Product';
import Group from '../../app/models/Group';

class FullUserBuyCatalogUtil {
  async run({ userTgId }) {
    const user = await User.findOne({
      where: { tgId: `${userTgId}` },
      include: [
        {
          model: Buy,
          include: [
            {
              model: Product,
              include: [{ model: Group }],
            },
          ],
        },
      ],
    });

    return user;
  }
}
export default new FullUserBuyCatalogUtil();
