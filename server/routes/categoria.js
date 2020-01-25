const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categorias');
const { verificaToken, verificaAdminRol } = require('../middleware/authentication');

// inicializa express
const app = express();

app.get('/categoria', [verificaToken], (req, res) => {
    // Aparecer todas las categorias

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    categorias
                });
            });

        });
});

// Aparecer todas las categorias por id 
app.get('/categoria/:id', [verificaToken], (req, res) => {
    let qry = { _id: req.params.id };

    Categoria.findById(qry)
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });

        });
});

// Agregar Categoria
app.post('/categoria', [verificaToken], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar categoria
app.put('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let desc = body.descripcion;
    let opt = { new: true, runValidators: true, context: 'query' }
    Categoria.findByIdAndUpdate(id, body, opt, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Borra categoria
app.delete('/categoria/:id', [verificaToken], (req, res) => {
    // Solo admin puede borrar
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

module.exports = app;