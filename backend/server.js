const express = require('express');
const path = require('path');
const productosRouter = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 3000;


// Montaje del router modular
app.use('/api/productos', productosRouter);


// Middleware 404 final
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.status(404).send('Página no encontrada');
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});