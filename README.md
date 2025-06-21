#TCC Agro -Campo
---

```markdown
# 🌾 TCC Agro Campo - Tienda Virtual Agropecuaria

**TCC Agro Campo** es una tienda virtual desarrollada como proyecto académico, pensada para digitalizar la compra y venta de productos agropecuarios. Utiliza tecnologías web modernas con un enfoque completo desde frontend hasta backend y persistencia en base de datos.

---

## 📌 Índice

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Conexión con Base de Datos](#-conexión-con-base-de-datos)
- [Descripción de Funciones Clave](#-descripción-de-funciones-clave)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Autor](#-autor)

---

## 💡 Características

- Catálogo dinámico de productos agropecuarios.
- Agregado de productos al carrito.
- Simulación de compra.
- Backend en Node.js con Express.
- Conexión a base de datos MySQL.
- Código modular y fácil de mantener.
- Posibilidad de integración con panel administrativo.

---

## 🛠 Tecnologías Utilizadas

| Tecnología  | Descripción                          |
|-------------|--------------------------------------|
| HTML5       | Estructura del sitio web             |
| CSS3        | Estilizado personalizado             |
| JavaScript  | Interactividad en el cliente         |
| Node.js     | Servidor y lógica del backend        |
| Express.js  | Framework para el manejo de rutas    |
| MySQL       | Base de datos relacional             |
| dotenv      | Configuración de variables de entorno|

---

## 🗂 Estructura del Proyecto


````

---

## 📦 Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/FranxP17/TCC-Agro-Campo.git
   cd TCC-Agro-Campo
````

2. **Instalar dependencias**

   ```bash
   npm install
   ```


3. **Ejecutar el servidor**

   ```bash
   node server.js
   ```

4. **Abrir en el navegador**

   ```
   http://localhost:3000
   ```

---

## 🔗 Conexión con Base de Datos

```js
// db/conexion.js
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
module.exports = db;
```

---

## 🧩 Descripción de Funciones Clave

* **`routes/productos.js`**

  * `GET /productos`: obtiene todos los productos.
  * `GET /productos/:id`: obtiene un producto por ID.
  * `POST /productos`: agrega un nuevo producto.
  * `PUT /productos/:id`: actualiza un producto.
  * `DELETE /productos/:id`: elimina un producto.

* **`models/productoModel.js`**

  * Funciones que ejecutan queries SQL como:

    ```js
    db.query('SELECT * FROM productos', callback);
    ```

* **`public/js/main.js`**

  * Maneja eventos del carrito.
  * Agrega productos usando fetch/AJAX.
  * Controla UI dinámica (modal, botones, etc).

---

## 👨‍💻 Autor

* Francisco Páez
* Danilo Gomez
* Keiner Hernandez

---
