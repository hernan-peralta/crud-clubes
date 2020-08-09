const express = require('express');
const fs = require('fs');
const multer = require('multer');
const exphbs = require('express-handlebars');

const upload = multer({ dest: './public/uploads/imagenes' });

const PUERTO = 8080;
const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  fs.readFile('./public/data/equipos.db.json', (err, data) => {
    res.render('home', {
      layout: 'layout',
      equipos: JSON.parse(data),
      titleTag: 'CRUD Clubes',
      script: '/src/main.js',
    });
  });
});

app.get('/equipo/:tla/ver', (req, res) => {
  const tla = req.params.tla;
  let indiceEquipo = 0;
  fs.readFile('./public/data/equipos.db.json', (err, data) => {
    for (let i = 0; i < (JSON.parse(data)).length; i++) {
      if ((JSON.parse(data))[i].tla === tla) {
        indiceEquipo = i;
      }
    }
    const vieneDeWeb = JSON.parse(data)[indiceEquipo].crestUrl.slice(0, 4) === 'http';

    res.render('ver', {
      layout: 'layout',
      equipo: JSON.parse(data)[indiceEquipo],
      vieneDeWeb,
      titleTag: JSON.parse(data).shortName,
    });
  });
});

app.get('/nuevo', (req, res) => {
  res.render('nuevoequipo', {
    layout: 'layout',
  });
});

app.post('/nuevo', upload.single('crestUrl'), (req, res) => {
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

app.get('/equipo/:tla/editar', (req, res) => {
  const tla = req.params.tla;
  const archivodb = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));
  let indiceEquipo = 0;

  for (let i = 0; i < archivodb.length; i++) {
    if (archivodb[i].tla === tla) {
      indiceEquipo = i;
    }
  }

  const vieneDeWeb = archivodb[indiceEquipo].crestUrl.slice(0, 4) === 'http';

  res.render('editar', {
    layout: 'layout',
    equipo: archivodb[indiceEquipo],
    vieneDeWeb,
    titleTag: archivodb[indiceEquipo].shortName,
  });
});

app.post('/equipo/:tla/editar', upload.none(), (req, res) => {
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

app.get('/equipo/:tla/borrar', (req, res) => {
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

app.listen(8080);
console.log(`Escuchando el puerto ${PUERTO}`);
