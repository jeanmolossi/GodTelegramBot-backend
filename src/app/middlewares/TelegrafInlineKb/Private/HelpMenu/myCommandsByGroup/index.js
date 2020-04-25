import TelegrafInlineMenu from 'telegraf-inline-menu';

import GetUserGroupsUtil from '../../../../../../Utils/UserMethods/GetUserGroupsUtil';
import FindLevelByGroupUtil from '../../../../../../Utils/GroupMethods/FindLevelByGroupUtil';

import commandsDescription from './commandsDescription';

const groupsList = {};
const commandsList = {};
const commandsByRole = {
  Member: ['Start', 'Staff', 'Help'],
  'Member VIP': ['Start', 'Staff', 'Help'],
  Helper: ['Del', 'Logdel'],
  SubModerator: ['Unwarn', 'Warn'],
  Moderator: ['Info', 'Mute', 'Notificacoes'],
  Administrator: [
    'Ban',
    'Unban',
    'Kick',
    'Reload',
    'Settings',
    'Freeuser',
    'Helper',
    'SubModerador',
    'Moderador',
    'Demote',
  ],
  CoFounder: ['Administrador', 'CoFundador', 'Demote'],
  Founder: ['CoFundador', 'Demote'],
};

async function loadGroups({ userTgId }) {
  const userGroups = await GetUserGroupsUtil.run({ userTgId });
  if (userGroups !== null)
    userGroups.map(gp => Object.assign(groupsList, { [gp.tgId]: gp.name }));
  return false;
}

async function loadCommandList({ groupTgId, userTgId }) {
  const group = await FindLevelByGroupUtil.run({ tgId: groupTgId, userTgId });
  if (!group) return false;

  const { userRole } = group.Users[0].UserGroup;
  if (userRole >= 1)
    Object.assign(commandsList, { Member: commandsByRole.Member });
  if (userRole >= 2)
    Object.assign(commandsList, {
      'Member VIP': commandsByRole['Member VIP'],
    });
  if (userRole >= 3)
    Object.assign(commandsList, { Helper: commandsByRole.Helper });
  if (userRole >= 4)
    Object.assign(commandsList, { SubModerator: commandsByRole.SubModerator });
  if (userRole >= 5)
    Object.assign(commandsList, { Moderator: commandsByRole.Moderator });
  if (userRole >= 6)
    Object.assign(commandsList, {
      Administrator: commandsByRole.Administrator,
    });
  if (userRole >= 7)
    Object.assign(commandsList, { CoFounder: commandsByRole.CoFounder });
  if (userRole >= 8)
    Object.assign(commandsList, { Founder: commandsByRole.Founder });
}

const myCommandsByGroup = new TelegrafInlineMenu(async context => {
  await loadGroups({ userTgId: context.from.id });
  return `Você possui comandos distintos em cada grupo em que participa`;
});

const groupSubmenu = new TelegrafInlineMenu(async context => {
  const groupTgId = context.match[1];
  const userTgId = context.from.id;
  await loadCommandList({ groupTgId, userTgId });
  const groupName = groupsList[context.match[1]];
  return `Comandos de suas funções no Grupo: ${groupName}`;
});
let roleSelected = null;
const specificRole = new TelegrafInlineMenu(async ctx => {
  const roleName = ctx.match[2];
  const groupName = groupsList[ctx.match[1]];
  roleSelected = roleName;
  return `Comandos da função ${roleName} no grupo ${groupName}`;
});

myCommandsByGroup.selectSubmenu(
  'gp',
  () => Object.keys(groupsList),
  groupSubmenu,
  {
    textFunc: (ctx, key) => {
      return groupsList[key];
    },
    columns: 1,
  }
);

groupSubmenu.selectSubmenu(
  'rl',
  () => Object.keys(commandsList),
  specificRole,
  {
    textFunc: (ctx, key) => {
      return `Comandos de ${key}`;
    },
    columns: 1,
  }
);

specificRole.selectSubmenu(
  'c',
  () => commandsByRole[roleSelected],
  commandsDescription,
  {
    textFunc: (ctx, _key) => {
      return `Comando /${_key.toLowerCase()}`;
    },
    columns: 1,
  }
);

export default myCommandsByGroup;
