const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;



    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    msg: 'No files were uploaded.'
                }
            });
    }

    //Valida tipo 
    let tiposVal = ['productos', 'usuarios'];
    if (tiposVal.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no permitido'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //extensiones permitidas
    let extVal = ['png', 'jpg', 'gif', 'jpeg'];

    if (extVal.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no permitido'
            }
        });
    }

    //Cambiar nombre archivo
    let nomArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    saveFile(tipo, nomArchivo, archivo);
    if (tipo == 'usuarios') {
        imagenUsuario(id, res, nomArchivo);
    } else if (tipo == 'productos') {
        imagenProducto(id, res, nomArchivo);
    };

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            deleteFile('usuarios', nombreArchivo);
            return res.status(400).josn({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }
        deleteFile('usuarios', usuarioDB.img);
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });
        });
    });



}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, prodDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!prodDB) {
            deleteFile('usuarios', nombreArchivo);
            return res.status(400).josn({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }
        deleteFile('productos', prodDB.img);
        prodDB.img = nombreArchivo;

        prodDB.save((err, productDB) => {
            res.json({
                ok: true,
                producto: productDB,
                img: nombreArchivo
            });
        });

    });

}

function deleteFile(type, name) {
    let pathImg = path.resolve(__dirname, `../../uploads/${ type }/${ name }`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

function saveFile(type, name, archivo) {
    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ type }/${ name }`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
    });

}
module.exports = app;