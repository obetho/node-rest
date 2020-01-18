const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRol = {
    values: ['ADMIN_ROL', 'USER_ROL'],
    message: '{VALUE} no es rol valido'
};

let Schema = mongoose.Schema;

let usuarioScm = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: validRol
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});

usuarioScm.methods.toJSON = function() {
    let usr = this;
    let usrObj = usr.toObject();
    delete usrObj.password;

    return usrObj;
};

usuarioScm.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuarioScm);