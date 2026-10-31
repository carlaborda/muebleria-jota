// Carga el catálogo inicial (data/catalogo.js) en MongoDB.
// Se puede correr varias veces: solo inserta los productos que todavía no existen
// (por nombre) y no toca los que ya están.
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Product');
const catalogo = require('./data/catalogo');

const uri = process.env.MONGO_URI;

async function cargarDatos() {
  try {
    await mongoose.connect(uri);

    const operaciones = catalogo.map(({ id, imagen, ...producto }) => ({
      updateOne: {
        filter: { nombre: producto.nombre },
        update: { $setOnInsert: { ...producto, imagenUrl: imagen, stock: 10 } },
        upsert: true,
      },
    }));

    const resultado = await Producto.bulkWrite(operaciones);
    console.log(`Productos insertados: ${resultado.upsertedCount} de ${catalogo.length}`);
  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

cargarDatos();
