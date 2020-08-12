const express = require('express');
const multer = require('multer');
const fs = require('fs');
const servicios = require('../services/services');

const router = express.Router();
const upload = multer({ dest: './public/uploads/imagenes' });

router.get('/:tla/ver', async (req, res) => {
  const { equipoSeleccionado, vieneDeWeb } = await servicios.mostrarDetalleEquipo(req);

  res.render('ver', {
    layout: 'layout',
    equipo: equipoSeleccionado,
    vieneDeWeb,
    titleTag: equipoSeleccionado.shortName,
  });
});

router.get('/:tla/editar', async (req, res) => {
  const { equipoAEditar, vieneDeWeb } = await servicios.mostrarEquipoEditar(req);

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

router.get('/:tla/borrar', async (req, res) => {
  await servicios.borrarEquipo(req);
  res.redirect('/');
});

module.exports = router;
