// Cargar usuarios en el select
async function cargarUsuarios() {
  const res = await fetch('/admin/usuarios');
  const usuarios = await res.json();
  const select = document.getElementById('product-user');
  select.innerHTML = '<option value="">Selecciona un usuario</option>';
  usuarios.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.idUser;
    opt.textContent = u.username;
    select.appendChild(opt);
  });
}

// Cargar imágenes del usuario seleccionado
document.getElementById('product-user').addEventListener('change', async function() {
  const idUser = this.value;
  const res = await fetch(`/admin/imagenes/${idUser}`);
  const imagenes = await res.json();
  const imgSelect = document.getElementById('product-img-select');
  imgSelect.innerHTML = '<option value="">Selecciona una imagen</option>';
  imagenes.forEach(img => {
    const opt = document.createElement('option');
    opt.value = img;
    opt.textContent = img.split('/').pop();
    imgSelect.appendChild(opt);
  });
  // Limpiar preview y campo de imagen
  document.getElementById('preview-img').style.display = 'none';
  document.getElementById('product-img').value = '';
});

// Mostrar preview de la imagen seleccionada y actualizar el input oculto
document.getElementById('product-img-select').addEventListener('change', function() {
  const img = this.value;
  const preview = document.getElementById('preview-img');
  if (img) {
    preview.src = img;
    preview.style.display = 'block';
    document.getElementById('product-img').value = img;
  } else {
    preview.style.display = 'none';
    document.getElementById('product-img').value = '';
  }
});

// Inicializar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', cargarUsuarios);



// Cargar productos y mostrarlos en la tabla
async function cargarProductos() {
  const res = await fetch('/admin/productos');
  const productos = await res.json();
  const tbody = document.getElementById('products-table-body');
  tbody.innerHTML = '';
  productos.forEach(producto => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${producto.idProducto}</td>
      <td>${producto.nombreProducto}</td>
      <td>${producto.precioProducto}</td>
      <td><img src="${producto.urlImagen}" alt="img" style="max-width:60px"></td>
      <td>
        <button class="edit-btn" data-id="${producto.idProducto}">Editar</button>
        <button class="delete-btn" data-id="${producto.idProducto}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Al hacer click en editar, carga los datos en el formulario
document.getElementById('products-table-body').addEventListener('click', async function(e) {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;
    const res = await fetch(`/admin/productos/${id}`);
    const producto = await res.json();
    document.getElementById('product-id').value = producto.idProducto;
    document.getElementById('product-name').value = producto.nombreProducto;
    document.getElementById('product-price').value = producto.precioProducto;
    document.getElementById('product-img').value = producto.urlImagen;
    document.getElementById('preview-img').src = producto.urlImagen;
    document.getElementById('preview-img').style.display = 'block';
  }
  // Eliminar producto
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      const res = await fetch(`/admin/productos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarProductos();
        alert('Producto eliminado');
      } else {
        alert('Error al eliminar');
      }
    }
  }
});

// Guardar (crear o actualizar) producto
document.getElementById('product-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const nombre = document.getElementById('product-name').value;
  const precio = document.getElementById('product-price').value;
  const imagen = document.getElementById('product-img').value;

  const producto = { nombre, precio, imagen };

  if (id) {
    // Actualizar
    const res = await fetch(`/admin/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (res.ok) {
      alert('Producto actualizado');
      document.getElementById('product-form').reset();
      document.getElementById('preview-img').style.display = 'none';
      cargarProductos();
    } else {
      alert('Error al actualizar');
    }
  } else {
    // Crear
    const res = await fetch('/admin/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    });
    if (res.ok) {
      alert('Producto creado');
      document.getElementById('product-form').reset();
      document.getElementById('preview-img').style.display = 'none';
      cargarProductos();
    } else {
      alert('Error al crear');
    }
  }
});

// Mostrar preview de la imagen
document.getElementById('product-img').addEventListener('input', function() {
  const url = this.value;
  const preview = document.getElementById('preview-img');
  if (url) {
    preview.src = url;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
});

// Inicializar productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);