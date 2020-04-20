import Extra from 'telegraf/extra';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import WarnService from '../../services/WarnService';
import FullUserBuyCatalogUtil from './FullUserBuyCatalogUtil';

class InfoCommandUtil {
  async run({ infoMember, toTgId, context }) {
    try {
      const user = await FullUserBuyCatalogUtil.run({
        userTgId: infoMember.user.id,
      });
      const userWarns = await WarnService.getAllWarnsRun({
        userTgId: infoMember.user.id,
      });
      // console.log(userWarns.Groups);
      const [groupsWarns] = userWarns.filter(
        (group) =>
          group.UserGroup &&
          group.tgId.toString() === context.update.message.chat.id.toString()
      );
      let userBuys;
      if (user.Buys && user.Buys.length >= 1) {
        userBuys = user.Buys.map((buy) => {
          const formattedDate = formatDistance(buy.signDate, new Date(), {
            addSuffix: true,
            locale: pt,
          });
          return (
            `Produto: ${buy.Product.productId}\nCompra: ${buy.sellCode}\n` +
            `Status da transação: ${buy.sellStatus}\nAssinatura: ${buy.signStatus}\n` +
            `Assinado ${formattedDate}`
          );
        });
      }
      if (userBuys !== undefined) {
        await context.telegram.sendMessage(
          toTgId,
          `Relatório do usuário: ` +
            `[${infoMember.user.first_name}](tg://user?id=${infoMember.user.id})\n\n` +
            `${userBuys.join('\n\n')}\n\nNo grupo *${
              groupsWarns.name
            }* esse usuário ` +
            `possui (${groupsWarns.UserGroup.warnsNumber} de 3) alertas`,
          Extra.markdown()
        );
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    await context.telegram.sendMessage(
      toTgId,
      `Não consigo buscar dados para o relatório`,
      Extra.markdown()
    );
    return false;
  }
}

export default new InfoCommandUtil();
