const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose'); 
const app = express();
const PORT = process.env.PORT || 3000;
 

// Si usas MongoDB Atlas (¡reemplaza con tu propia cadena de conexión!):
// Para obtener esta cadena, ve a tu Cluster en Atlas, haz clic en "Connect",
// luego "Connect your application" y copia la URL.
const DB_URI = process.env.MONGO_URI;
 
 
// *** Conexión a la Base de Datos ***
mongoose.connect(DB_URI)
  .then(() => console.log('¡Conexión exitosa a MongoDB!'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));
 
// Configuración básica de Express
app.use(express.json());
 
// Definir una ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando y conectado a MongoDB (esperemos!)');
});
 
// Ruta de 404 y manejo de errores (ya lo teníamos de clases anteriores)
app.use((req, res, next) => {
  res.status(404).send('Página no encontrada');
});
 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal en el servidor');
});
 
// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
  console.log(`Accede desde tu navegador: http://localhost:${PORT}`);
});