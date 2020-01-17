require("./config/config");

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', function(req, res) {
    res.json('Hello World 222');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${ process.env.PORT }`);
});

//obtener datos
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

// POST CREAR Registros
app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: "Es necesario el nombre"
        });
    }

    res.json({ body });
});

// Put Actualizar datos.

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    res.json({
        id
    });
});


// Delete borrar 
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});