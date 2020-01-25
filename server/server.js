require("./config/config");

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuracion global rutas
app.use(require('./routes/index'));


app.get('/', function(req, res) {
    res.json('Hello World 222');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${ process.env.PORT }`);
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
    (err) => {
        if (err) throw err;
        console.log('Base de datos online');
    });