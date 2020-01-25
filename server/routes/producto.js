const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middleware/authentication');

let app = express();

app.get('/productos', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({})
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(400), json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }
            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    producto: productos
                });
            });

        });
});


app.get('/productos/:id', verificaToken, (req, res) => {
    let qry = { _id: req.params.id };

    Producto.findById(qry)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400), json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//Crear producto
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.desc,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, ProductoDB) => {
        //usuarioDB.password = null;
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: ProductoDB
        });

    });

});

//Actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let opt = { new: true, runValidators: true, context: 'query' }
    Producto.findByIdAndUpdate(id, body, opt, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


//Borrar producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let setData = { disponible: false };
    let opt = { new: true, runValidators: true, context: 'query' }

    Producto.findByIdAndUpdate(id, setData, opt, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//buscar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        });
});

module.exports = app;