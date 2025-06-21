const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcrypt');

router.put('/:id', async (req, res) => {
  console.log('PUT recibido:', req.params.id, req.body);
  const { nombre, email, username, password } = req.body || {};
  console.log('Valores recibidos:', { nombre, email, username, password });
  if (!nombre || !email || !username) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  let query = 'UPDATE usuarios SET nombreUser=?, emailUser=?, username=?';
  let params = [nombre, email, username];

  if (password && password.trim() !== '') {
    const hashedPassword = await bcrypt.hash(password, 10);
    query += ', password=?';
    params.push(hashedPassword);
  }

  query += ' WHERE idUser=?';
  params.push(req.params.id);

  db.query(query, params, (err) => {
    if (err)  {
      console.error('Error SQL:', err); // <-- Agrega esto
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
    res.json({ success: true });
  });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM usuarios WHERE idUser=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.json({ success: true });
  });
});


module.exports = router;