const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.json());
// app.use('/admin', adminRoutes);
app.use(express.urlencoded({ extended: true }));

const registerRoute = require('./routes/register'); // OJO: usa './', no '../'
const loginRoute = require('./routes/login');
const adminRoute = require('./routes/admin');
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

app.use(express.static(path.join(__dirname, 'public'))); // Sirve HTML

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/html/index.html')); // Sirve el HTML
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/html/register.html')); // Sirve el HTML
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/html/inicio_sesion.html')); // Sirve el HTML
});

app.get('/recuperar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/html/olvidaste_contrasena.html')); // Sirve el HTML
});

app.use('/register', registerRoute); // Ruta para manejar POST
app.use('/login', loginRoute); // Ruta para manejar POST de login
app.use('/admin', adminRoute); // Rutas CRUD admin

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
