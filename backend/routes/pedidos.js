const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware"); // ajustá la ruta según tu proyecto

router.post("/", verifyToken, (req, res) => {
  const usuario = req.usuario || req.user;
  if (!usuario) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  const total = items.reduce(
    (suma, item) => suma + Number(item.precio || 0) * Number(item.cantidad || 1),
    0
  );

  return res.status(201).json({
    mensaje: "Compra simulada registrada",
    pedido: {
      id: `sim_${Date.now()}`,
      usuario: {
        id: usuario.id ?? usuario._id,
        username: usuario.username,
        rol: usuario.rol,
      },
      items,
      total,
      creadoEn: new Date().toISOString(),
    },
  });
});

module.exports = router;