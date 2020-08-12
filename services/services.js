const multer = require('multer');
const fs = require('fs').promises;

const upload = multer({ dest: './public/uploads/imagenes' });

exports.mostrarIndice = async function () {
  const datos = await fs.readFile('./public/data/equipos.db.json', (err, data) => data);
  return JSON.parse(datos);
};

exports.nuevoEquipo = function (req ) {
  if (req.file === undefined) {
    req.file = {};
    req.file.filename = '';
  }

  const archivodb = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));
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

  archivodb.push(nuevoequipo);
  fs.writeFileSync('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));
};

exports.mostrarEquipoEditar = async function (req) {
  const tla = req.params.tla;
  const archivodb = JSON.parse(await fs.readFile('./public/data/equipos.db.json'));
  const equipoAEditar = archivodb.find((team) => tla === team.tla);
  const vieneDeWeb = equipoAEditar.crestUrl.slice(0, 4) === 'http';

  return { equipoAEditar, vieneDeWeb };
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
