import TelegrafInlineMenu from 'telegraf-inline-menu';

import FullUserBuyCatalogUtil from '../../../Utils/UserMethods/FullUserBuyCatalogUtil';

const groupsSubmenu = new TelegrafInlineMenu(
  'Toque no botão abaixo para receber o(s) link(s).'
);

const getGroups = async (userTgId) => {
  const userBoughts = await FullUserBuyCatalogUtil.run({
    userTgId, // PRIVATE CHAT IS USER
  });
  return userBoughts;
};

const groupsList = async (_ctx) => {
  const userBoughts = await getGroups(
    _ctx.update.callback_query.message.chat.id
  );

  if (userBoughts && userBoughts.Buys) {
    userBoughts.Buys.map(async (buy) => {
      if (buy.Product) {
        if (buy.Product.Groups) {
          await buy.Product.Groups.map(async (group) => {
            const chatLink = await _ctx.telegram.exportChatInviteLink(
              group.tgId
            );
            await _ctx.replyWithMarkdown(`[Grupo: ${group.name}](${chatLink})`);
          });
        }
      }
      return true;
    });
  }
};

groupsSubmenu.button('Receber link dos grupos', 'grouplinks', {
  doFunc: async (_ctx) => {
    await _ctx.answerCbQuery('Recebendo links...');
    groupsList(_ctx);
  },
  setParentMenuAfter: () => true,
});

export default groupsSubmenu;
