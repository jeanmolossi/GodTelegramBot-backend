import jwt from 'jsonwebtoken';
import * as yup from 'yup';

import User from '../models/User';
import Config from '../models/Config';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const schemaValid = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });
    if (!(await schemaValid.isValid(req.body)))
      return res.status(400).json({ error: 'Validations fail to login' });

    const user = await User.findOne({
      where: { email },
    });
    if (!user) return res.status(400).json({ error: 'User not found!' });

    if (!user.canLogin)
      return res.status(400).json({ error: 'User can not login' });

    if (!(await user.checkPassword(password)))
      return res.status(401).json({ error: 'Invalid password' });

    const { id, name, tgId, canLogin } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        tgId,
        canLogin,
      },
      token: jwt.sign({ id, tgId }, process.env.SECRET_MD5, {
        expiresIn: '7d',
      }),
    });
  }

  async indexConfig(req, res) {
    const schemaRehydrate = yup.object().shape({
      email: yup.string().email().required(),
    });

    if (!(await schemaRehydrate.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fail to reHydrate' });

    const { email } = req.body;

    const userConfig = await User.findOne({
      where: { email, canLogin: true },
      attributes: ['name', 'email', 'level', 'tgId', 'tgPic', 'ConfigId'],
      include: [
        {
          model: Config,
          attributes: ['consumerKey'],
        },
      ],
    });

    // if (!(userConfig && userConfig.Config))
    //   return res.status(401).json({ error: 'User has not config' });

    return res.json(userConfig);
  }
}

export default new SessionController();
