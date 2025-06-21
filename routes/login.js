const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Ruta para procesar el inicio de sesión
router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  }
  const sql = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
    // Usuario autenticado correctamente
    const user = results[0];
    res.status(200).json({
      idUser: user.idUser,
      nombreUser: user.nombreUser,
      emailUser: user.emailUser,
      username: user.username,
      message: 'Inicio de sesión exitoso'
    });
  });
});

module.exports = router;