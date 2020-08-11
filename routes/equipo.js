const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: './public/uploads/imagenes' });

router.get('/:tla/ver', (req, res) => {
  const tla = req.params.tla;
  fs.readFile('./public/data/equipos.db.json', (err, data) => {
    const equipoSeleccionado = JSON.parse(data).find((team) => tla === team.tla);
    const vieneDeWeb = equipoSeleccionado.crestUrl.slice(0, 4) === 'http';

    res.render('ver', {
      layout: 'layout',
      equipo: equipoSeleccionado,
      vieneDeWeb,
      titleTag: equipoSeleccionado.shortName,
    });
  });
});

router.get('/:tla/editar', (req, res) => {
  const tla = req.params.tla;
  const archivodb = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));

  const equipoAEditar = archivodb.find((team) => tla === team.tla);

  const vieneDeWeb = equipoAEditar.crestUrl.slice(0, 4) === 'http';

  res.render('editar', {
    layout: 'layout',
    equipo: equipoAEditar,
    vieneDeWeb,
    titleTag: equipoAEditar.shortName,
  });
});

router.post('/:tla/editar', upload.none(), (req, res) => {
  const tla = req.params.tla;
  const archivodb = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));
  let indiceEquipo = 0;
  for (let i = 0; i < archivodb.length; i++) {
    if (archivodb[i].tla === tla) {
      indiceEquipo = i;
    }
  }

  Object.keys(req.body).forEach((key) => { archivodb[indiceEquipo][key] = req.body[key]; });

  const vieneDeWeb = archivodb[indiceEquipo].crestUrl.slice(0, 4) === 'http';

  fs.writeFileSync('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));

  res.render('editar', {
    layout: 'layout',
    equipo: archivodb[indiceEquipo],
    vieneDeWeb,
    data: {
      mensaje: '¡Equipo actualizado con éxito!',
    },
  });
});

router.get('/:tla/borrar', (req, res) => {
  const tla = req.params.tla;

  const archivodb = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));

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
    fs.unlinkSync(`./public/uploads/imagenes/${nombreImagen}`, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log('hubo un error al intentar borrar la imagen', err);
  }

  fs.writeFileSync('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));
  res.redirect('/');
});

module.exports = router;
