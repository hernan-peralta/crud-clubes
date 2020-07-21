const express = require('express');
const fs = require('fs');
const multer = require('multer');

const upload = multer({ dest: './public/uploads/imagenes' });

const exphbs = require('express-handlebars');

const PUERTO = 8080;
const app = express();
const hbs = exphbs.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//app.use(express.static(path.join(__dirname, '/public')));
//app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use('/public', express.static('public'))
// app.use('/public', express.static(`${__dirname}/public`));

app.use(express.static(`${__dirname}/public`));
// app.use('/ver', express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  const equipos = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));
  res.render('home',{
    layout: 'layout',
    equipos: equipos,
  });
});


app.get('/equipo/:tla/ver', (req, res) => {
  const tla = req.params.tla
  const equipo = JSON.parse(fs.readFileSync(`./public/data/equipos/${tla}.json`));
  const vieneDeWeb = equipo.crestUrl.slice(0,4) === 'http';
  res.render('ver',{
    layout: 'layout',
    equipo,
    vieneDeWeb,
  });
});


app.get('/nuevo', (req, res) => {
  res.render('nuevoequipo',{
    layout: 'layout',
  });
});


app.post('/nuevo', upload.single('crestUrl'), (req, res) => {
  res.render('nuevoequipo',{
    layout: 'layout',
    data:{
      mensaje: "¡Exito!",
      nombreArchivo: req.file.filename,
    },
  });
  let archivodb = JSON.parse(fs.readFileSync('./public/data/equipos.db.json'));
  const nuevoequipo = {
                      "id": archivodb[archivodb.length - 1].id + 1,
                      "area": {
                        "id": 2072,
                        "name": "England"
                      },
                      "name": req.body.name,
                      "shortName": req.body.shortName,
                      "tla": req.body.tla,
                      "crestUrl":req.file.name,
                      "address": req.body.address,
                      "phone": req.body.phone,
                      "website": req.body.website,
                      "email": req.body.email,
                      "founded": req.body.founded,
                      "clubColors": req.body.clubColors,
                      "venue": req.body.venue,
                      "lastUpdated": (new Date).toISOString(),
                    };

  //creo el archivo .json dentro de /equipos y le adoso los arrays para las competiciones y los jugadores
  let archivoNuevoEquipo = JSON.parse(JSON.stringify(nuevoequipo));
  archivoNuevoEquipo = Object.assign(archivoNuevoEquipo, {"activeCompetitions":[], "squad": []});
  fs.writeFileSync(`./public/data/equipos/${nuevoequipo.tla}.json`, JSON.stringify(archivoNuevoEquipo));

  archivodb.push(nuevoequipo);
  fs.writeFileSync('./public/data/equipos.db.json', JSON.stringify(archivodb, null, 2));

});


app.get('/equipo/:tla/editar', (req, res) => {
  const tla = req.params.tla
  const equipo = JSON.parse(fs.readFileSync(`./public/data/equipos/${tla}.json`));
  res.render('editar',{
    layout: 'layout',
    equipo,
  });
});


// app.patch('/equipo/:tla/editar', (req, res) => {

// })


app.listen(8080);
console.log(`Escuchando el puerto ${PUERTO}`);
