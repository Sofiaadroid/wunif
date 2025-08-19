const Product = require('../models/Product');

exports.list = async (req, res) => {
  try {
    const { size, model, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };
    if (size) filter.size = size;
    if (model) filter.model = model;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    const products = await Product.find(filter).sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error('Error en GET /api/products:', err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
};

exports.create = async (req, res) => {
  const { name, model, size, price, imageUrl } = req.body;
  if (price <= 0) return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  const product = await Product.create({ name, model, size, price, imageUrl });
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'No encontrado' });
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};

exports.remove = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'No encontrado' });
  await product.deleteOne();
  res.status(204).end();
};
