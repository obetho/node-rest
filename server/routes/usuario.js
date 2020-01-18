const express = require('express');
// inicializa express
const app = express();

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');
//obtener datos
app.get('/usuario', function(req, res) {

    let qry = { estado: true };
    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    Usuario.find(qry, 'nombre email rol estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count(qry, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios
                });
            });

        });
});

// POST CREAR Registros
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });

    usuario.save((err, usuarioDB) => {
        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

// Put Actualizar datos.

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    //let body = req.body; //_.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'rol', 'estado']);

    //console.log(JSON.stringify(body));

    Usuario.findByIdAndUpdate(id, body, { new: true },
        (err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
                id
            });
        });


});

// Delete borrar 
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let option = { estado: false };
    // borra el usuario
    //Usuario.findByIdAndDelete(id, option, (err, usuarioBorrado) => {
    //Actualiza el usuario
    Usuario.findByIdAndUpdate(id, option, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;