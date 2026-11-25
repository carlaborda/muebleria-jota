const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;
