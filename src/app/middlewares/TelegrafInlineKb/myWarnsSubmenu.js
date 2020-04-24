import TelegrafInlineMenu from 'telegraf-inline-menu';

import WarnService from '../../../services/WarnService';

const myWarnsSubmenu = new TelegrafInlineMenu(
  'Toque o botão abaixo para receber.'
);

async function myWarns(context, next) {
  if (!context.update.callback_query) return next();
  const { message } = context.update.callback_query;
  try {
    await context.answerCbQuery('Buscando relatório...');
    const userWarns = await WarnService.getAllWarnsRun({
      userTgId: message.chat.id,
    });
    if (userWarns && userWarns) {
      const warns = userWarns.map((group) => {
        let alertFormat = 'Você não possui alertas';
        if (group.UserGroup.warnsNumber === 1)
          alertFormat = `Você possui 1 alerta`;
        else if (group.UserGroup.warnsNumber > 1)
          alertFormat = `Você possui ${group.UserGroup.warnsNumber} alertas`;
        return `Em relação ao Grupo ${group.name}:\n${alertFormat}\n`;
      });
      await context.replyWithMarkdown(
        `*Seu relatório de conduta:*\n\n${warns.join('\n\n')}\n\n` +
          `Reforçando que o limite de alertas por grupo são 3. Ao atingir 3 alertas ` +
          `em um grupo, você é automaticamente banido, até que seja reestabelecido ` +
          `seu acesso.`
      );
    }
  } catch (error) {
    return false;
  }
  return next();
}

myWarnsSubmenu.button('Receber relatório', 'receiveWarnReport', {
  doFunc: async (_ctx, nxt) => {
    await myWarns(_ctx, nxt);
  },
  setParentMenuAfter: () => true,
});

export default myWarnsSubmenu;
