const express = require('express');
const path = require('path');
const productosRouter = require('./routes/productos');
const logger = require('./mi-logger.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware logger
app.use(logger);

//Middleware para peticiones POST O PUT
app.use(express.json());

// Montaje del router modular
app.use('/api/productos', productosRouter);


// Middleware 404 final
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.status(404).send('Página no encontrada');
});

// Middleware de errores generales (4 parámetros)
app.use((err, req, res, next) => {
  console.error('[Error de servidor]:', err.message);
  
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: true,
    mensaje: err.message || 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});