const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/', (req, res) => {
  const { name, email, username, password, confirmPassword, terms } = req.body;

  if (!terms) return res.status(400).send('Debes aceptar los términos.');
  if (password !== confirmPassword) return res.status(400).send('Las contraseñas no coinciden.');

  const sql = 'INSERT INTO usuarios (nombreUser, emailUser, username, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, username, password], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.redirect('/html/inicio_sesion.html');
  });
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', '/html/register.html')); // Sirve el HTML
});


module.exports = router;
