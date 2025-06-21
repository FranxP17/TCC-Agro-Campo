const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Middleware para parsear JSON correctamente en Express
router.use(express.json());
router.use("/productos", express.static("productos"));
// Middleware para parsear urlencoded (por si acaso)
router.use(express.urlencoded({ extended: true }));

// Obtener todos los productos
router.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al obtener productos" });
    res.json(results);
  });
});

// Obtener un producto por ID
router.get("/productos/:idProducto", (req, res) => {
  db.query(
    "SELECT * FROM productos WHERE idProducto = ?",
    [req.params.idProducto],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(404).json({ error: "Producto no encontrado" });
      res.json(results[0]);
    }
  );
});

// Crear producto
router.post("/productos", (req, res) => {
  const { nombre, precio, imagen } = req.body;
  db.query(
    "INSERT INTO productos (nombreProducto, precioProducto , urlImagen) VALUES (?, ?, ?)",
    [nombre, precio, imagen],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Error al crear producto" });
      res.json({ id: result.insertId, nombre, precio, imagen });
    }
  );
});

// Actualizar producto
router.put("/productos/:idProducto", (req, res) => {
  const { nombre, precio, imagen } = req.body;
  db.query(
    "UPDATE productos SET nombreProducto=?, precioProducto=?, urlImagen=? WHERE idProducto=?",
    [nombre, precio, imagen, req.params.idProducto],
    (err) => {
      if (err)
        return res.status(500).json({ error: "Error al actualizar producto" });
      res.json({ id: req.params.idProducto, nombre, precio, imagen });
    }
  );
});

// Eliminar producto
router.delete("/productos/:idProducto", (req, res) => {
  db.query(
    "DELETE FROM productos WHERE idProducto=?",
    [req.params.idProducto],
    (err) => {
      if (err)
        return res.status(500).json({ error: "Error al eliminar producto" });
      res.json({ success: true });
    }
  );
});

module.exports = router;
