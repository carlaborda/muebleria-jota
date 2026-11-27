const jwt = require('jsonwebtoken');
 
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  // 1. Verificamos que el encabezado y el token existan
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]; // Extraemos el token
 
    // 2. Verificamos el token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {
      if (err) {
        // Si el token no es válido (expirado, manipulado)
        return res.status(403).json({ message: 'Token inválido o expirado' }); // 403 Forbidden
    }
 
      // 3. Si es válido, guardamos el payload (info del user) en el objeto 'req'
      // para que las rutas posteriores puedan usarlo.
      req.user = decodedPayload;
      next(); // 4. Dejamos que la petición continúe hacia su destino
    });
  } else {
    // Si no hay token, no hay acceso
    res.status(401).json({ message: 'No estás autenticado' }); // 401 Unauthorized
  }
};
 
module.exports = verifyToken;