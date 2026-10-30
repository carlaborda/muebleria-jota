// Modelo con: nombre, descripcion, precio, stock, imagenUrl

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // Es un campo obligatorio
    trim: true      // Elimina espacios en blanco al principio y final
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: true, // Es un campo obligatorio
    min: 0          // El precio no puede ser negativo
  },
  stock: {
    type: Number,
    default: 0,     // Si no se envía, el stock inicial es 0
    min: 0          // El stock no puede ser negativo
  },
  imagenUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true  // Añade automáticamente 'createdAt' y 'updatedAt'
});

// Compilamos el esquema en un modelo llamado 'Producto'
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;