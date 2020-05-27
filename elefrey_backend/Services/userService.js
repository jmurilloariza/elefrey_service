const Service = require('../Database/service');

class UserServiceImplement extends Service {

    constructor() {
        super(['user_id', 'user_firstname', 'user_lastname', 'user_password', 'user_phone',
            'user_address', 'user_identification', 'user_email'], 'user', ['user_id']);
    }

}

module.exports = UserServiceImplement;