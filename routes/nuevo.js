const express = require('express');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './public/uploads/imagenes' });

router.get('/', (req, res) => {
  res.render('nuevoequipo', {
    layout: 'layout',
  });
});

router.post('/', upload.single('crestUrl'), (req, res) => {
  // si no subo ninguna imagen creo el campo file.filename para que no me rompa toda la aplicacion
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

  res.render('nuevoequipo', {
    layout: 'layout',
    data: {
      mensaje: '¡Exito!',
      nombreArchivo: req.file.filename,
    },
  });
});

module.exports = router;
