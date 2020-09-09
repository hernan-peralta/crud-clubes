const express = require('express');
const servicios = require('../services/services');

const router = express.Router();

router.get('/', async (req, res) => {
  const datos = await servicios.mostrarIndice();

  res.render('home', {
    layout: 'layout',
    equipos: datos,
    titleTag: 'CRUD Clubes',
    script: '/src/main.js',
  });
});

module.exports = router;
