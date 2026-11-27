const express = require('express');
const Categoria = require('../models/Categoria');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  const categorias = await Categoria.find().sort({ nombre: 1 });
  res.json(categorias);
});

router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const categoria = await Categoria.create({ nombre: req.body.nombre });
  res.status(201).json(categoria);
});

module.exports = router;
