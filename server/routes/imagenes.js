const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middleware/authentication');
let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let noImage = path.resolve(__dirname, '../assets/no-image.jpg')

    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(noImage);
    }
});


module.exports = app;