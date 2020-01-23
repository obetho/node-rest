const jwt = require('jsonwebtoken');

// =================
// Valida token
// =================

let verificaToken = function(req, res, next) {

    let token = req.get('token'); //Authorization
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    err,
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

// =================
// ValidaAdmin
// =================

let verificaAdminRol = function(req, res, next) {

    let usuario = req.usuario;
    console.log(usuario);
    if (usuario.rol != 'ADMIN_ROL') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No tiene privilegios para esta APP'
            }
        });
    }

    next();
};

module.exports = {
    verificaToken,
    verificaAdminRol
};