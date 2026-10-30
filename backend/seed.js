

// prueba para ver si funciona la base de datos
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Product');


const uri = process.env.MONGO_URI;

async function cargarDatos() {
  try {
    await mongoose.connect(uri);
    
    const producto = new Producto({ 
      nombre: 'Mesa de Comedor', 
      precio: 85000,
      stock: 5 
    });
    
    await producto.save();
    console.log("Producto guardado exitosamente");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(); // Cierra el script al terminar
  }
}

cargarDatos();