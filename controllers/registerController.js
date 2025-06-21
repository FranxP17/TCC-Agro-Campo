const db = require('../../Agro/models/db');

exports.registerUser = (req, res) => {
  const { name, email, username, password, confirmPassword, terms } = req.body;

  if (!terms) return res.status(400).send('Debes aceptar los términos.');
  if (password !== confirmPassword) return res.status(400).send('Las contraseñas no coinciden.');

  const sql = 'INSERT INTO usuarios (nombre, email, username, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, username, password], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.send('Usuario registrado exitosamente');
  });
};
