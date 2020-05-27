const Service = require('../Database/service');

class MaterialServiceImplement extends Service {

    constructor() {
        super(['mat_id', 'mat_name', 'mat_unidades', 'mat_unit_measure', 'mat_description',
            'mat_image'], 'material', ['mat_id']);
    }

}

module.exports = MaterialServiceImplement;