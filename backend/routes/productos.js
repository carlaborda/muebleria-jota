// API RESTful con CRUD (GET, POST, PUT, DELETE)

// routes/productos.js
const express = require('express');
const Producto = require('../models/Product');

const router = express.Router();

const NO_ENCONTRADO = { error: 'Producto no encontrado' };

// Solo estos campos se pueden escribir desde la API (no _id ni timestamps)
function camposPermitidos(body = {}) {
  const { nombre, descripcion, precio, stock, imagenUrl } = body;
  return Object.fromEntries(
    Object.entries({ nombre, descripcion, precio, stock, imagenUrl })
      .filter(([, valor]) => valor !== undefined)
  );
}

// GET /api/productos
router.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);

  if (!producto) {
    return res.status(404).json(NO_ENCONTRADO);
  }

  res.json(producto);
});

// POST /api/productos
router.post('/', async (req, res) => {
  const producto = await Producto.create(camposPermitidos(req.body));
  res.status(201).json(producto);
});

// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);

  if (!producto) {
    return res.status(404).json(NO_ENCONTRADO);
  }

  // save() corre todas las validaciones del esquema
  producto.set(camposPermitidos(req.body));
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
