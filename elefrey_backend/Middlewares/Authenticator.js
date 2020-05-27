const middlewares = [];
const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "misterioso_secreto";

const UserServiceImplement = require('../Services/userService');
const userService = new UserServiceImplement();

middlewares.ensureAuthGet = async (req, res, next) => {
    if (!req.headers.authenticator || !req.headers.id) {
        return res.status(200).send({ message: "la peticion no tiene completa la cabecera de autentificacion", status: "fail", res: req.headers });
    }

    const token = req.headers.authenticator.replace(/['"]+/g, "");

    try {
        var payload = jwt.decode(token, secret);
        let time = moment().unix();

        if (payload.exp <= time) {
            return res.status(200).send({ message: "token ha expirado", status: "fail" });
        }

        if (payload.id) {
            let resultUser = await userExists(payload.id);
            if (resultUser) {
                req.user = payload;
                return next();
            }
        }

        res.status(200).send({ message: "false token", status: "fail" });

    } catch (ex) {
        logger.error(ex);
        return res.status(200).send({ message: "token no valido", status: "fail" });
    }
};

/**
 * Meddleware para el manejo de sesión, validación de tokens y manejo de redis 
 */
// !req.headers.authenticator
// ensureAuthGetAll => ensureAuthGetAllAndroid
middlewares.validateSesion = async (req, res, next) => {
    if (!req.headers.authenticator || !req.query.q)
        return res.status(200).send({ message: "la peticion no tiene completa la cabecera de autentificacion", status: "fail" });

    try {
        const token = req.headers.authenticator.replace(/['"]+/g, "");
        let payload = jwt.decode(token, secret);
        let time = moment().unix();

        if (payload.exp <= time) return res.status(200).send({ message: "el token expiro", status: "fail" });

        if (payload.id) {
            req.user = payload;
            return next();
        }

        return res.status(200).send({ message: "token no valido", status: "fail", data: "No" });
    } catch (ex) {
        console.log(ex);
        console.log("token no valido");
        return res.status(200).send({ message: "token no valido", status: "fail", data: "Entro por el catch" });
    }
}

async function userExists(user_id) {
    try {
        return new Promise((resolve, reject) => {
            userService.getById([user_id]).then(result => {
                if (typeof result == 'boolean') resolve(false);
                resolve(true);
            });
        });
    } catch (error) {
        logger.error(error);
        return res.status(200).send({ message: "invalid token", status: "fail" });
    }
}

module.exports = middlewares;