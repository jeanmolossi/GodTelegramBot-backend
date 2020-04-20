import Rule from '../../app/models/Rule';
import Group from '../../app/models/Group';

export default class RuleMethods {
  constructor(subject) {
    this.subject = subject;

    this.subject.subscribe('setRule', this.setRule.bind(this));

    return this;
  }

  /**
   *
   * @param {RULES METHODS} ruleType
   */

  async findOrCreateRule(ruleType) {
    const [rule] = await Rule.findOrCreate({
      where: {
        type: ruleType,
      },
    });

    return rule;
  }

  async addRuleToGroup(groupTgId, ruleType) {
    const group = await Group.findByTgId(groupTgId);
    const rule = await this.findOrCreateRule(ruleType);

    if (!group || group === null) return false;
    await group.addRule(rule.id);
    return true;
  }

  async getGroupRules(groupTgId) {
    const group = await Group.findByTgId(groupTgId);
    if (!group || group === null) {
      return false;
    }
    const rules = await group.getRule();

    return rules;
  }

  async removeGroupRule(groupTgId, ruleType) {
    const group = await Group.findByTgId(groupTgId);
    const rule = await Rule.findByType(ruleType);

    if (!group || group === null) {
      return false;
    }
    const ruleToRemove = await group.removeRule(rule);
    return ruleToRemove;
  }

  async hasThatRule(groupTgId, ruleType) {
    const group = await Group.findByTgId(groupTgId);
    const rule = await Rule.findByType(ruleType);

    if (!group || group === null) {
      return false;
    }
    const hasRule = await group.hasRule(rule);
    return hasRule;
  }

  async setRule({ ruleId, ruleStats, chatId, userId, context }) {
    const ruleType = [
      'NULL_INPUT',
      'DENY_SPAM', // 1
      'DENY_FLOOD', // 2
      'DENY_BOT', // 3
      'DENY_BOT_FORWARD', // 4
      'DENY_CHAT_FORWARD', // 5
      'DENY_LINK', // 6
    ];
    if (ruleStats === 'on') {
      const addRule = await this.addRuleToGroup.call(
        this,
        chatId,
        ruleType[ruleId]
      );
      console.log(addRule);
      return true;
    }
    const removeRule = await this.removeGroupRule.call(
      this,
      chatId,
      ruleType[ruleId]
    );
    console.log(removeRule);
  }
}
