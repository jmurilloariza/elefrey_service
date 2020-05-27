"use strict"

const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "misterioso_secreto";

exports.createToken = (user) => {
    const payload = {
        id: user.user_identification,
        name: user.user_name,
        email: user.user_email,
        phone: user.user_phone,
        role: user.user_role,
        image: user.user_image,
        position: user.user_position,
        status: user.user_state,
        code: user.user_id_user,
        iat: moment().unix(),
        exp: moment().add(9, "hours").unix()
    }
    return jwt.encode(payload, secret);
};

exports.createTokenCommerce = (user) => {
    const payload = {
        id: user.usco_id,
        name: user.usco_name,
        phone: user.usco_phone,
        cellphone: user.usco_cellphone,
        iat: moment().unix(),
        exp: moment().add(9, "hours").unix()
    }
    return jwt.encode(payload, secret);
};