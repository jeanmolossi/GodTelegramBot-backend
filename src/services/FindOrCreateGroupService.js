import Group from '../app/models/Group';
import User from '../app/models/User';
import Buy from '../app/models/Buy';

class FindOrCreateGroupService {
  async run({
    groupTgId,
    groupName = null,
    adminTgId = null,
    productId = null,
    context = null,
  }) {
    // IF HAS GROUP WITH THIS TGID - IF NO HAS CREATE THIS
    const [group, hasGroup] = await Group.findOrCreate({
      where: {
        tgId: `${groupTgId}`,
      },
    });

    if (hasGroup && group.name === null && groupName !== null) {
      await group.update({ name: groupName });
    }
    if (adminTgId !== null) {
      const admin = await User.findByTgId(adminTgId);
      // console.log(admin);
      if (admin) {
        admin.addGroup(group, { through: { userRole: 8 } });
      } else {
        return false;
      }
    }
    if (productId !== null) {
      const produto = await Buy.findByProductId(productId);
      if (produto) {
        produto.addGroup(group, { through: 'ProductGroup' });
        group.setProduct(produto);
      } else {
        return false;
      }
    }
    if (context !== null) {
      await context.reply(`✅ Configurações reinicializadas`);
    }
    return group;
  }
}

export default new FindOrCreateGroupService();
