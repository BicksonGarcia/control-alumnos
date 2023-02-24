const {request, response} = require('express');
const esMaestroRole = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'No podemos validar tu rol sin que inicies sesion antes.'
        })
    }

    const {role, nombre} = req.user
    if(role != 'ROLE_MAESTRO'){
        return res.status(401).json({
            msg: 'Deberias ser un maestro para realizar esta accion.'
        })
    }



    next();
}

const esAlumnoRole = (req = request, res = response) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'No podemos validar tu rol sin que inicies sesion antes.'

        })
    }
}
module.exports = {
    esMaestroRole,
    esAlumnoRole
}