
// routes/productos.js
const express = require('express');
const Producto = require('../models/Product');
const Categoria = require('../models/Categoria');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

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
  try {
    const filtro = req.query.categoria !== undefined ? { categoria: req.query.categoria } : {};
    const productos = await Producto.find(filtro).populate('categoria', 'nombre');
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoria', 'nombre');

    if (!producto) {
      return res.status(404).json(NO_ENCONTRADO);
    }

    res.json(producto);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// POST /api/productos
router.post('/', verifyToken , verifyAdmin , async (req, res) => {
  try {
    const campos = camposPermitidos(req.body);
    if (campos.categoria !== undefined && !(await Categoria.exists({ _id: campos.categoria }))) {
      return res.status(400).json({ error: 'La categoría no existe' });
    }

    const producto = await Producto.create(campos);
    res.status(201).json(producto);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// PUT /api/productos/:id
router.put('/:id', verifyToken , verifyAdmin , async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json(NO_ENCONTRADO);
    }

    const campos = camposPermitidos(req.body);
    if (campos.categoria !== undefined && !(await Categoria.exists({ _id: campos.categoria }))) {
      return res.status(400).json({ error: 'La categoría no existe' });
    }

    // save() corre todas las validaciones del esquema
    producto.set(campos);
    await producto.save();

    res.json(producto);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE /api/productos/:id
router.delete('/:id', verifyToken , verifyAdmin , async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
      return res.status(404).json(NO_ENCONTRADO);
    }

    res.json({ mensaje: 'Producto eliminado', producto });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
