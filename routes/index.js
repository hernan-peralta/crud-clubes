const fs = require('fs');
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  fs.readFile('./public/data/equipos.db.json', (err, data) => {
    res.render('home', {
      layout: 'layout',
      equipos: JSON.parse(data),
      titleTag: 'CRUD Clubes',
      script: '/src/main.js',
    });
  });
});

module.exports = router;
