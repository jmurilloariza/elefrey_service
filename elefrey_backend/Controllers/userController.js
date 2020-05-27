const jwt = require("../Bin/Jwt");
const simplejwt = require("jwt-simple");
const bcrypt = require('bcrypt');
const secret = "misterioso_secreto";
const controller = {};

const cassandra = require('cassandra-driver').types.Uuid;

const UserServiceImplement = require('../Services/userService');
const userService = new UserServiceImplement();

controller.save = (req, res) => {
    try {
        let request = req.body;
        let user_id = cassandra.random();

        console.log(request);


        if (!request.user_firstname || !request.user_lastname || !request.user_phone ||
            !request.user_address || !request.user_identification || !request.user_email)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        bcrypt.hash(request.user_identification, 10, async function (err, hash) {
            if (err) {
                console.log(err.stack);
                return res.status(404).send({ message: 'encryption error', status: 'error', data: [] });
            }

            let validate = await userService.find([], { user_email: request.user_email });
            console.log(validate);

            if (typeof validate == 'boolean') return res.status(200).send({ message: 'Erro en BD', status: 'error', data: [] });

            if (validate.length > 0) return res.json({ message: 'Ya hiciste un usuario con este email', status: 'error', data: [] });

            validate = await userService.find([], { user_identification: request.user_identification });

            if (typeof validate == 'boolean') return res.status(200).send({ message: 'Erro en BD' });
            if (validate.length > 0) return res.json({ message: 'Ya hiciste un usuario con este documento', status: 'error', data: [] });

            const user = {
                user_id: user_id,
                user_firstname: request.user_firstname,
                user_lastname: request.user_lastname,
                user_password: hash,
                user_phone: request.user_phone,
                user_address: request.user_address,
                user_identification: request.user_identification,
                user_email: request.user_email,
            };

            userService.save(user, true).then(result => {
                if (typeof result == 'boolean') return res.status(200).send({ message: err2 });
                if (Object.values(result.rows[0])[0])
                    return res.status(200).send({ message: "Usuario registrado", applied: Object.values(result.rows[0])[0], status: 'ok', data: [] });

                return res.status(200).send({ message: "El usuario ya existe", applied: Object.values(result.rows[0])[0], status: 'error', data: [] });
            });

        });
    } catch (ex) {
        console.log(ex.stack);
        res.status(200).send({ error: "catch error", status: 'error', data: [] });
    }
}

controller.delete = (req, res) => {
    try {
        let userID = req.query.user_id;

        if (!userID)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        userService.delete({ user_id: userID }).then(result => {
            if (typeof result == 'boolean')
                return res.status(200).send({ message: 'query error', status: 'error', data: [] });

            return res.json({ message: 'Usuario eliminado', status: 'ok', data: result })
        });
    } catch (ex) {
        console.log(ex.stack);
        return res.status(200).send({ error: "catch error", status: 'error', data: [] });
    }
}

controller.logIn = (req, res) => {
    try {
        let request = req.body;

        if (!request.user_email || !request.user_password)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        userService.find([], { user_email: request.user_email.toLowerCase() }).then(user => {
            if (typeof user == 'boolean')
                return res.status(200).send({ message: 'query error' });

            if (user.length <= 0)
                return res.status(200).send({ message: "Usuario invalido", status: 'error', data: [] });

            bcrypt.compare(request.user_password, user[0].user_password, async (errB, data) => {
                if (!data)
                    return res.status(200).send({ message: "Contraseña inválida", status: "error", data: [] });

                let token = jwt.createToken(user[0]);

                if (typeof result == 'boolean')
                    return res.status(200).send({ message: 'query error', status: 'error', data: [] });

                if (!Object.values(user[0])[0])
                    return res.status(200).send({ message: "invalid user", status: 'error', data: [] });
                console.log(user);
                
                return res.status(200).send({
                    message: 'Login', status: 'success',
                    data: { token: token, username: `${user[0].user_firstname} ${user[0].user_lastname}` }
                });

            });
        });

    } catch (ex) {
        console.log(ex.stack);
        res.status(404).send({ error: "catch error", status: 'error', data: [] });
    }
};

controller.update = (req, res) => {
    try {
        let request = req.body;

        if (!request.user_id)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        userService.find([], { user_id: request.user_id }).then(user => {
            if (typeof user == 'boolean')
                return res.status(200).send({ message: "No se encontró el usuario", status: 'error', data: [] });

            if (user.length <= 0)
                return res.status(200).send({ message: "No se encontró el usuario", status: 'error', data: [] });

            userService.update(request, true).then(result => {
                if (typeof result == 'boolean')
                    return res.status(200).send({ message: 'query error', status: 'error', data: [] });

                res.json({ message: 'Usuario actualizado', status: 'ok', data: [] })
            });
        });

    } catch (ex) {
        console.log(ex.stack);
        return res.status(200).send({ message: "No se encontró el usuario", status: 'error', data: [] });
    }
}

controller.getAll = (req, res) => {
    userService.find([], {}).then(result => {
        if (typeof result == 'boolean')
            return res.status(200).send({ message: 'query error', status: 'error', data: [] });

        return res.json({ message: 'ok', status: 'ok', data: result })
    });
}

controller.getUserID = (req, res) => {
    try {
        let userID = req.query.user_id;

        if (!userID)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        userService.find([], { user_id: userID }).then(result => {
            if (typeof result == 'boolean')
                return res.status(200).send({ message: 'query error', status: 'error', data: [] });

            return res.json({ message: 'ok', status: 'ok', data: result })
        });
    } catch (ex) {
        console.log(ex.stack);
        res.status(200).send({ message: 'Este usuario no existe', status: 'error', data: [] });
    }
}

module.exports = controller;