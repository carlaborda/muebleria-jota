// API RESTful con CRUD (GET, POST, PUT, DELETE)

// routes/productos.js
const express = require('express');
const Producto = require('../models/Product');
const Categoria = require('../models/Categoria');

const router = express.Router();

const NO_ENCONTRADO = { error: 'Producto no encontrado' };

// Solo estos campos se pueden escribir desde la API (no _id ni timestamps)
function camposPermitidos(body = {}) {
  const { nombre, descripcion, precio, stock, imagenUrl, categoria } = body;
  return Object.fromEntries(
    Object.entries({ nombre, descripcion, precio, stock, imagenUrl, categoria })
      .filter(([, valor]) => valor !== undefined)
  );
}

// GET /api/productos
router.get('/', async (req, res) => {
  const filtro = req.query.categoria !== undefined ? { categoria: req.query.categoria } : {};
  const productos = await Producto.find(filtro).populate('categoria', 'nombre');
  res.json(productos);
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id).populate('categoria', 'nombre');

  if (!producto) {
    return res.status(404).json(NO_ENCONTRADO);
  }

  res.json(producto);
});

// POST /api/productos
router.post('/', async (req, res) => {
  const campos = camposPermitidos(req.body);
  if (campos.categoria !== undefined && !await Categoria.exists({ _id: campos.categoria })) {
    return res.status(400).json({ error: 'La categoría no existe' });
  }

  const producto = await Producto.create(campos);
  res.status(201).json(producto);
});

// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);

  if (!producto) {
    return res.status(404).json(NO_ENCONTRADO);
  }

  const campos = camposPermitidos(req.body);
  if (campos.categoria !== undefined && !await Categoria.exists({ _id: campos.categoria })) {
    return res.status(400).json({ error: 'La categoría no existe' });
  }

  // save() corre todas las validaciones del esquema
  producto.set(campos);
  await producto.save();

  res.json(producto);
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  const producto = await Producto.findByIdAndDelete(req.params.id);

  if (!producto) {
    return res.status(404).json(NO_ENCONTRADO);
  }

  res.json({ mensaje: 'Producto eliminado', producto });
});

module.exports = router;
