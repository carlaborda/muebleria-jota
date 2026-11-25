// Carga el catálogo inicial (data/catalogo.js) en MongoDB.
// Se puede correr varias veces: solo inserta los productos que todavía no existen
// (por nombre) y no toca los que ya están.
require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Product');
const Categoria = require('./models/Categoria');
const catalogo = require('./data/catalogo');

const uri = process.env.MONGO_URI;
const categoriasPorProducto = {
  'Mesa de Noche Aconcagua': 'Mesas',
  'Sofá Patagonia': 'Sillones',
  'Mesa Comedor Pampa': 'Mesas',
  'Sillas Córdoba': 'Sillas',
  'Escritorio Costa': 'Escritorios',
  'Silla de Trabajo Belgrano': 'Sillas',
  'Aparador Uspallata': 'Guardado',
  'Biblioteca Recoleta': 'Guardado',
  'Butaca Mendoza': 'Sillones',
  'Sillón Copacabana': 'Sillones',
  'Mesa de Centro Araucaria': 'Mesas',
};

async function cargarDatos() {
  try {
    await mongoose.connect(uri);

    const nombresCategorias = [...new Set(Object.values(categoriasPorProducto))];
    await Categoria.bulkWrite(nombresCategorias.map((nombre) => ({
      updateOne: {
        filter: { nombre },
        update: { $setOnInsert: { nombre } },
        upsert: true,
      },
    })));

    const categorias = await Categoria.find({ nombre: { $in: nombresCategorias } });
    const categoriaPorNombre = new Map(categorias.map((categoria) => [categoria.nombre, categoria._id]));

    const operaciones = catalogo.map(({ id, imagen, ...producto }) => {
      const nombreCategoria = categoriasPorProducto[producto.nombre];
      const categoria = categoriaPorNombre.get(nombreCategoria);
      if (!categoria) {
        throw new Error(`No se encontró la categoría "${nombreCategoria}" para "${producto.nombre}"`);
      }

      return {
        updateOne: {
          filter: { nombre: producto.nombre },
          update: {
            $set: { categoria },
            $setOnInsert: { ...producto, imagenUrl: imagen, stock: 10 },
          },
          upsert: true,
        },
      };
    });

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
