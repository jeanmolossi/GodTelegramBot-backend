import Product from '../models/Product';

export default async (req, res, next) => {
  const { id } = req.params; // PRODUCT PK

  const productOwner = await Product.findOne({
    where: { id, UserId: req.userId },
  });

  if (!productOwner) {
    return res.status(401).json({ error: 'You are not owner of product' });
  }
  return next();
};
