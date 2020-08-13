const express = require('express');
const servicios = require('../services/services');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('nuevoequipo', {
    layout: 'layout',
    script: '/src/nuevo.js',
  });
});

router.post('/', servicios.multerArchivo('crestUrl'), async (req, res) => {
  const { vieneDeWeb, nombreArchivo } = await servicios.nuevoEquipo(req);

  res.render('nuevoequipo', {
    layout: 'layout',
    script: '/src/nuevo.js',
    vieneDeWeb,
    data: {
      mensaje: '¡Exito!',
      nombreArchivo: nombreArchivo,
    },
  });
});

module.exports = router;
