import * as yup from 'yup';

import Config from '../models/Config';
import User from '../models/User';

class ConfigController {
  async index(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['name', 'email', 'level', 'tgId', 'tgPic', 'ConfigId'],
      include: [
        {
          model: Config,
          attributes: ['consumerKey'],
        },
      ],
    });
    if (!(user && user.Config))
      return res.json({ error: 'User has not config' });

    return res.json(user);
  }

  async store(req, res) {
    const schemaValid = yup.object().shape({
      consumerKey: yup.string().required(),
    });
    if (!(await schemaValid.isValid(req.body)))
      return res.status(400).json({ error: 'Consumer key is missing' });

    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'level', 'tgId', 'tgPic', 'ConfigId'],
      include: [
        {
          model: Config,
          attributes: ['consumerKey'],
        },
      ],
    });
    if (user && user.Config) return res.json({ error: 'User already config' });

    const { consumerKey } = req.body;
    const config = await Config.findOne({
      where: { consumerKey },
    });
    if (config) return res.status(401).json({ error: 'Config already exists' });

    const newConfig = await Config.create(req.body);
    await user.setConfig(newConfig);

    return res.json({ consumerKey });
  }

  async update(req, res) {
    const schemaValid = yup.object().shape({
      consumerKey: yup.string().required(),
    });
    if (!(await schemaValid.isValid(req.body)))
      return res.status(400).json({ error: 'Consumer key is missing' });

    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'level', 'tgId', 'tgPic', 'ConfigId'],
      include: [
        {
          model: Config,
          attributes: ['consumerKey'],
        },
      ],
    });
    if (!(user && user.Config))
      return res.status(400).json({ error: 'User has not config' });

    const { consumerKey } = req.body;
    const configToUpdate = await Config.findByPk(user.ConfigId);
    if (!configToUpdate)
      return res.status(400).json({ error: 'Fetching config has failed' });

    await configToUpdate.update(req.body);

    return res.json({ consumerKey });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'ConfigId'],
      include: [{ model: Config, attributes: ['consumerKey'] }],
    });
    if (!(user && user.Config))
      return res.status(400).json({ error: 'User has not config' });

    const del = await Config.findByPk(user.ConfigId);
    await del.destroy();

    return res.json({ deleted: 'Success' });
  }
}

export default new ConfigController();
