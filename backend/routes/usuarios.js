const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const router = express.Router();
 
//RUTAS PUBLICAS
// RUTA DE REGISTRO
router.post('/register', async (req, res) => {
  try {
    // 1. Recibimos y limpiamos los datos del formulario
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Todos los campos (username, email y password) son obligatorios.',
      });
    }

    // 2. Verificamos si el usuario o email ya existen
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: 'El email o nombre de usuario ya está en uso.',
      });
    }

    // 3. Hasheamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Creamos el nuevo usuario (el rol toma el default del esquema: 'usuario')
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 5. Guardamos el usuario en la base de datos
    const savedUser = await newUser.save();

    // 6. Respondemos al frontend (sin enviar la contraseña)
    res.status(201).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      rol: savedUser.rol,
    });
  } catch (error) {
    // Si Mongoose dispara error de índice único (E11000) por condición de carrera
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'El email o nombre de usuario ya está en uso.',
      });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// RUTA DE LOGIN
router.post('/login', async (req, res) => {
  try {
    // 1. Buscamos al usuario por su email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Usamos un mensaje genérico por seguridad
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
 
    // 2. Comparamos la contraseña enviada con la hasheada en la BD
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }
 
    const token = jwt.sign(
        { id: user._id, username: user.username, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        mail: user.email,
        rol: user.rol,
      },
    });
 
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
 
//RUTAS PROTEGIDAS
// Ejemplo: obtener perfil del usuario autenticado
/*router.get('/perfil', verifyToken, async (req, res) => {
  try {
    // verifyToken ya puso el payload decodificado en req.user
    const usuario = await User.findById(req.user.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
*/
 
module.exports = router;