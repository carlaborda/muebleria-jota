const verifyAdmin = (req, res, next) => {
  // verifyToken debe ejecutarse antes para poblar req.user desde el JWT
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requiere rol de administrador' });
  }

  next();
};

module.exports = verifyAdmin;