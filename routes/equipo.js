const express = require('express');
const servicios = require('../services/services');

const router = express.Router();

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

router.post('/:tla/editar', servicios.multerTexto(), async (req, res) => {
  const { equipo, vieneDeWeb } = await servicios.editarEquipo(req);

  res.render('editar', {
    layout: 'layout',
    equipo: equipo,
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
