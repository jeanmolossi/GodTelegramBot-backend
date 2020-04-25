import TelegrafInlineMenu from 'telegraf-inline-menu';

import EventEmitter from '../../../../../store/EventEmitter';
import RuleMethods from '../../../../../database/methods/Rule';

const configs = {
  'Anti-Spam': 'off',
  'Anti-Flood': 'off',
  'Anti-Bot': 'off',
  'Anti-Encaminhar-de-bot': 'off',
  'Anti-Enchaminhar-de-chats': 'off',
  'Anti-Link': 'off',
};

async function initializer(context) {
  const rulesDb = await RuleMethods.getGroupRules(
    context.update.callback_query.message.chat.id
  );
  const ruleType = [
    'DENY_SPAM', // 0
    'DENY_FLOOD', // 1
    'DENY_BOT', // 2
    'DENY_BOT_FORWARD', // 3
    'DENY_CHAT_FORWARD', // 4
    'DENY_LINK', // 5
  ];
  const ruleName = [
    'Anti-Spam',
    'Anti-Flood',
    'Anti-Bot',
    'Anti-Encaminhar-de-bot',
    'Anti-Enchaminhar-de-chats',
    'Anti-Link',
  ];
  if (rulesDb && rulesDb.length > 0) {
    rulesDb.map(ruleDB => {
      const ruleId = ruleType.indexOf(ruleDB.type);

      const key = ruleName[ruleId];
      configs[key] = 'on';

      return true;
    });
  }
  // console.log(rulesDb);
}

const rulesConfigSubmenu = new TelegrafInlineMenu(async context => {
  await initializer(context);
  return `Selecione as regras que deseja Ativar / Desativar`;
});

function setRule(context) {
  const { data } = context.update.callback_query;
  const chatId = context.update.callback_query.message.chat.id;
  const ruleName = data.replace(/rulesConfig:setRule-/, '');
  const ruleId = Object.keys(configs).indexOf(ruleName) + 1;
  const ruleStats = configs[ruleName] === 'off' ? 'on' : 'off';
  EventEmitter.notify('setRule', {
    ruleId,
    ruleStats,
    chatId,
    userId: context.update.callback_query.from.id,
    context,
  });
}

rulesConfigSubmenu.select('setRule', Object.keys(configs), {
  setFunc: (_ctx, key) => {
    const RegturnState = configs[key] === 'on' ? 'off' : 'on';
    setRule(_ctx);
    configs[key] = RegturnState;
  },
  isSetFunc: (_ctx, key) => {
    return configs[key] === 'on';
  },
  textFunc: (_ctx, key) => {
    if (configs[key] === 'off') return `❌ Ativar ${key}`;
    return key;
  },
  hide: () => false,
  columns: 1,
  setMenuAfter: true,
});

export default rulesConfigSubmenu;
