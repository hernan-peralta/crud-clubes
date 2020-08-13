const express = require('express');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './public/uploads/imagenes' });

router.get('/', (req, res) => {
  res.render('nuevoequipo', {
    layout: 'layout',
    script: '/src/nuevo.js',
  });
});

router.post('/', upload.single('crestUrl'), (req, res) => {
  // si no subo ninguna imagen creo el campo file.filename para que no me rompa toda la aplicacion
  let vieneDeWeb = '';
  console.log('req.file es', req.file);
  if (req.file === undefined) {
    req.file = {};
    req.file.filename = req.body.urlImagen || '';
    vieneDeWeb = req.file.filename.slice(0, 4) === 'http';
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
  console.log('viene de web?', vieneDeWeb);
  res.render('nuevoequipo', {
    layout: 'layout',
    script: '/src/nuevo.js',
    vieneDeWeb,
    data: {
      mensaje: '¡Exito!',
      nombreArchivo: req.file.filename,
    },
  });
});

module.exports = router;
