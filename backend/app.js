const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const productosRouter = require('./routes/productos');
const logger = require('./mi-logger.js');

const app = express();
const PORT = process.env.PORT || 3000;

const DB_URI = process.env.MONGO_URI;

// Errores del driver que indican que la base no está disponible
const ERRORES_DE_CONEXION = [
  'MongooseError',
  'MongoNetworkError',
  'MongoServerSelectionError',
  'MongoNotConnectedError',
];

// Orígenes del front habilitados en producción (separados por coma).
// En desarrollo no hace falta: el proxy de Vite evita el CORS.
const origenesPermitidos = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

// Configuración básica de Express
app.use(logger);
app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());

// Definir una ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando y conectado a MongoDB');
});

// Montaje del router modular
app.use('/api/productos', productosRouter);

// Ruta de 404 y manejo de errores (ya lo teníamos de clases anteriores)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint no encontrado' });
  }
  res.status(404).send('Página no encontrada');
});

app.use((err, req, res, next) => {
  // ID con formato inválido
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  // Validaciones del esquema de Mongoose
  if (err.name === 'ValidationError') {
    const detalles = Object.fromEntries(
      Object.entries(err.errors).map(([campo, error]) => [
        campo,
        error.name === 'CastError' ? `Valor inválido para ${campo}` : error.message,
      ])
    );
    return res.status(400).json({ error: 'Datos de producto inválidos', detalles });
  }

  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' });
  }

  console.error('[Error de servidor]:', err.stack);

  if (ERRORES_DE_CONEXION.includes(err.name)) {
    return res.status(503).json({ error: 'Base de datos no disponible' });
  }

  res.status(err.status || 500).json({ error: 'Error interno del servidor' });
});

// *** Conexión a la Base de Datos e inicio del servidor ***
async function iniciar() {
  if (!DB_URI) {
    console.error('Falta la variable de entorno MONGO_URI (ver backend/.env.example)');
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('¡Conexión exitosa a MongoDB!');
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    console.log(`Accede desde tu navegador: http://localhost:${PORT}`);
  });
}

iniciar();
