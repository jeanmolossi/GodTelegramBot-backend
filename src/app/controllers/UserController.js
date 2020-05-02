import * as yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ['name', 'email', 'level', 'tgId', 'tgPic', 'ConfigId'],
    });

    if (!user) return res.status(400).json({ error: 'User not found!' });

    return res.json(user);
  }

  async store(req, res) {
    const { name, email, tgId } = req.body;

    const schemaValidation = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
      tgId: yup.string().required(),
    });

    if (!(await schemaValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }

    const [user] = await User.findOrCreate({
      where: { tgId: `${tgId}` },
    });
    if (!(user.email === null && user.password_hash === null)) {
      return res.status(400).json({ error: 'User already register' });
    }

    await user.update({ ...req.body, canLogin: true });

    return res.json({ name, email, tgId });
  }

  async update(req, res) {
    const schemaValidation = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      oldPassword: yup.string(),
      password: yup
        .string()
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required().min(6) : field
        ),
      confirmPassword: yup
        .string()
        .when('password', (password, field) =>
          password ? field.required().oneOf([yup.ref('password')]) : field
        ),
      tgId: yup.string(),
    });

    if (!(await schemaValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists)
        return res.status(400).json({ error: 'E-mail already registered' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(401).json({ error: 'Wrong password' });

    await user.update(req.body);

    return res.json(user);
  }

  async delete(req, res) {
    const schemaValidation = yup.object().shape({
      oldPassword: yup.string().required(),
    });

    if (!(await schemaValidation.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }
    const { oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (!(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'You cannot deactivate account!' });
    }
    await user.update({ canLogin: false });
    return res.status(200).json();
  }
}

export default new UserController();
