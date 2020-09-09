const multer = require('multer');
const fs = require('fs').promises;

const upload = multer({ dest: './public/uploads/imagenes' });

exports.multerTexto = function () {
  return upload.none();
};

exports.multerArchivo = function (parametro) {
  return upload.single(parametro);
};

exports.mostrarIndice = async function () {
  const datos = await fs.readFile('./public/data/equipos.db.json', (err, data) => data);
  return JSON.parse(datos);
};

exports.nuevoEquipo = async function (req) {
  // si no subo ninguna imagen creo el campo file.filename para que no me rompa toda la aplicacion
  let vieneDeWeb = '';
  if (req.file === undefined) {
    req.file = {};
    req.file.filename = req.body.urlImagen || '';
    vieneDeWeb = req.file.filename.slice(0, 4) === 'http';
  }

  const archivodb = JSON.parse(await fs.readFile('./public/data/equipos.db.json'));
  const nuevoequipo = {
    id: archivodb[archivodb.length - 1].id + 1,
    area: {
      id: 2072,
      name: 'England',
    },
    name: req.body.name,
    shortName: req.body.shortName,
    tla: req.body.tla,
    crestUrl: req.file.filename,
    address: req.body.address,
    phone: req.body.phone,
    website: req.body.website,
    email: req.body.email,
    founded: req.body.founded,
    clubColors: req.body.clubColors,
    venue: req.body.venue,
    lastUpdated: (new Date()).toISOString(),
  };

  const nombreArchivo = req.file.filename;
  archivodb.push(nuevoequipo);
  await fs.writeFile('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));

  return { vieneDeWeb, nombreArchivo };
};

exports.mostrarEquipoEditar = async function (req) {
  const tla = req.params.tla;
  const archivodb = JSON.parse(await fs.readFile('./public/data/equipos.db.json'));
  const equipoAEditar = archivodb.find((team) => tla === team.tla);
  const vieneDeWeb = equipoAEditar.crestUrl.slice(0, 4) === 'http';

  return { equipoAEditar, vieneDeWeb };
};

exports.editarEquipo = async function (req) {
  const tla = req.params.tla;
  const archivodb = JSON.parse(await fs.readFile('./public/data/equipos.db.json'));
  let indiceEquipo = 0;
  for (let i = 0; i < archivodb.length; i++) {
    if (archivodb[i].tla === tla) {
      indiceEquipo = i;
    }
  }

  Object.keys(req.body).forEach((key) => { archivodb[indiceEquipo][key] = req.body[key]; });

  const equipo = archivodb[indiceEquipo];
  const vieneDeWeb = archivodb[indiceEquipo].crestUrl.slice(0, 4) === 'http';

  await fs.writeFile('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));

  return { equipo, vieneDeWeb };
};

exports.mostrarDetalleEquipo = async function (req) {
  const tla = req.params.tla;
  const archivodb = JSON.parse(await fs.readFile('./public/data/equipos.db.json'));
  const equipoSeleccionado = archivodb.find((team) => tla === team.tla);
  const vieneDeWeb = equipoSeleccionado.crestUrl.slice(0, 4) === 'http';

  return { equipoSeleccionado, vieneDeWeb };
};

exports.borrarEquipo = async function (req) {
  const tla = req.params.tla;

  const archivodb = JSON.parse(await fs.readFile('./public/data/equipos.db.json'));

  let indiceABorrar;
  let nombreImagen;

  Object.keys(archivodb).forEach((key) => {
    if (archivodb[key].tla === tla) {
      indiceABorrar = key;
      nombreImagen = archivodb[key].crestUrl;
      // borro el elemento
      archivodb.splice(indiceABorrar, 1);
    }
  });

  try {
    await fs.unlink(`./public/uploads/imagenes/${nombreImagen}`, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log('hubo un error al intentar borrar la imagen', err);
  }

  await fs.writeFile('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));
};
