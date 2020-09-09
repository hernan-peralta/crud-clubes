const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const PUERTO = 8080;
const app = express();
const hbs = exphbs.create();

const indexRouter = require('./routes/index');
const equipoRouter = require('./routes/equipo');
const nuevoRouter = require('./routes/nuevo');

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/equipo', equipoRouter);
app.use('/nuevo', nuevoRouter);

app.listen(8080);
console.log(`Escuchando el puerto ${PUERTO}`);
