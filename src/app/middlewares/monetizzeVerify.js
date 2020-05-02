import { getToken } from '../../Utils/monetizzeUtils';

export default async (req, res, next) => {
  const { consumerKey } = req.body;

  try {
    const tokenRes = await getToken(consumerKey);
    if (!tokenRes)
      return res
        .status(400)
        .json({ error: 'ConsumeyKey provided is not Valid!' });
  } catch (erro) {
    return res.status(400).json({ error: 'Can not find credentials' });
  }

  return next();
};
