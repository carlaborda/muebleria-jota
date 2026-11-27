// Pruebas del contrato de Categorías. Se corren con el servidor prendido:
//   npm run dev   (en una terminal)
//   npm test      (en otra)
const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const API = process.env.API_URL || 'http://localhost:3000/api';
const SECRET = process.env.JWT_SECRET || 'tu_secreto_dev';
const ID_QUE_NO_EXISTE = '6712f0a1c3e9a1b2c3d4e5f6';

async function pedir(metodo, ruta, body) {
  const respuesta = await fetch(API + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const datos = await respuesta.json();
  return { status: respuesta.status, datos };
}


// Token válido pero con rol distinto a 'admin'
const tokenUsuario = jwt.sign(
  { id: '6712f0a1c3e9a1b2c3d4e500', username: 'usuario_comun', rol: 'usuario' },
  SECRET,
  { expiresIn: '1h' }
);

async function pedirConToken(ruta, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(API + ruta, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      nombre: `Producto No Admin ${Date.now()}`,
      precio: 15000,
    }),
  });

  const datos = await respuesta.json().catch(() => ({}));
  return { status: respuesta.status, datos };
}

test('GET /categorias → 200 con una lista de categorías', async () => {
  const { status, datos } = await pedir('GET', '/categorias');
  assert.equal(status, 200);
  assert.ok(Array.isArray(datos) && datos.length > 0, 'tiene que haber categorías (¿corriste el seed?)');
  assert.ok(datos[0]._id && datos[0].nombre, 'cada categoría tiene _id y nombre');
});

test('POST /categorias → 201; repetida → 409; sin nombre → 400', async () => {
  const nombre = `Prueba ${Date.now()}`;
  const creada = await pedir('POST', '/categorias', { nombre });
  assert.equal(creada.status, 201);
  assert.equal(creada.datos.nombre, nombre);

  const repetida = await pedir('POST', '/categorias', { nombre });
  assert.equal(repetida.status, 409);
  assert.ok(repetida.datos.error, 'responde { error }');

  const vacia = await pedir('POST', '/categorias', {});
  assert.equal(vacia.status, 400);
  assert.ok(vacia.datos.error, 'responde { error }');
});

test('GET /productos → cada producto trae su categoría con nombre (populate)', async () => {
  const { status, datos } = await pedir('GET', '/productos');
  assert.equal(status, 200);
  const conCategoria = datos.filter((p) => p.categoria);
  assert.ok(conCategoria.length > 0, 'al menos un producto tiene categoría');
  for (const p of conCategoria) {
    assert.equal(typeof p.categoria, 'object', `la categoría de "${p.nombre}" es un id suelto: falta populate`);
    assert.ok(p.categoria.nombre, `la categoría de "${p.nombre}" no trae nombre`);
  }
});

test('GET /productos?categoria=<id> → solo productos de esa categoría', async () => {
  const { datos: categorias } = await pedir('GET', '/categorias');
  assert.ok(Array.isArray(categorias), 'GET /categorias no devuelve una lista');
  const { datos: todos } = await pedir('GET', '/productos');
  const usada = categorias.find((c) => todos.some((p) => p.categoria?._id === c._id));
  assert.ok(usada, 'hay una categoría con productos');

  const { status, datos } = await pedir('GET', `/productos?categoria=${usada._id}`);
  assert.equal(status, 200);
  assert.ok(datos.length > 0 && datos.length < todos.length, 'filtra: trae algunos, no todos');
  for (const p of datos) assert.equal(p.categoria._id, usada._id);
});

test('GET /productos/:id → el detalle también trae la categoría con nombre', async () => {
  const { datos: todos } = await pedir('GET', '/productos');
  const uno = todos.find((p) => p.categoria);
  assert.ok(uno, 'ningún producto tiene categoría (¿corriste el seed nuevo?)');
  const { status, datos } = await pedir('GET', `/productos/${uno._id}`);
  assert.equal(status, 200);
  assert.ok(datos.categoria?.nombre, 'falta populate en el detalle');
});


test('No admin no puede dar de alta productos en /admin/crear-producto → 403', async () => {
  const { status, datos } = await pedirConToken('/admin/crear-producto', tokenUsuario);

  assert.equal(status, 403);
  assert.ok(datos.error || datos.message, 'debe devolver un mensaje de error');
});

test('Sin token no puede dar de alta productos en /admin/crear-producto → 401', async () => {
  const { status } = await pedirConToken('/admin/crear-producto', null);

  assert.equal(status, 401);
});
