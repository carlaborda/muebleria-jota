// routes/productos.js
const express = require('express');
const router = express.Router();
const productos = require('../data/catalogo');

// GET /api/productos
router.get('/', (req, res) => {
  res.json(productos);
});

// GET /api/productos/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
});

module.exports = router;