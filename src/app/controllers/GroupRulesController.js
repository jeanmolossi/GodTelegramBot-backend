import Group from '../models/Group';

import RuleMethods from '../../database/methods/Rule';

class GroupRulesController {
  async index(req, res) {
    const { id } = req.params;

    const group = await Group.findByTgId(id);
    const rules = await group.getRules();

    return res.json({ rules });
  }

  async update(req, res) {
    const { ruleId, ruleStats, groupTgId } = req.body;

    const response = await RuleMethods.setRule({
      ruleId,
      ruleStats,
      chatId: groupTgId,
    });

    if (!response) return res.status(400).json({ error: 'Cannot update rule' });
    return res.json({ ruleStats, groupTgId });
  }
}

export default new GroupRulesController();
