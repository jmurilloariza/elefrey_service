const controller = {};
const cassandra = require('cassandra-driver').types.Uuid;

const MaterialServiceImplement = require('../Services/materialService');
const materialService = new MaterialServiceImplement();

controller.save = (req, res) => {
    try {
        let request = req.body;

        if (!request.mat_name || !request.mat_description || !request.mat_unidades || !request.mat_unit_measure)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        let mat_id = cassandra.random();

        let material = {
            mat_name: request.mat_name,
            mat_description: request.mat_description,
            mat_unidades: request.mat_unidades,
            mat_unit_measure: request.mat_unit_measure,
            mat_id: mat_id,
            mat_image: ''
        }

        materialService.save(material).then(result => {
            if (typeof result == 'boolean')
                return res.status(200).send({ message: 'query error', status: 'error', data: [] });

            return res.json({ message: 'Material registrado', status: 'ok', data: [] })
        });


    } catch (ex) {
        console.log(ex.stack);
        res.status(200).send({ error: "catch error", status: 'error', data: [] });
    }
}

controller.update = (req, res) => {
    try {
        let request = req.body;

        if (!request.mat_name || !request.mat_description || !request.mat_unidades || !request.mat_unit_measure || !request.mat_id)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        let material = {
            mat_name: request.mat_name,
            mat_description: request.mat_description,
            mat_unidades: request.mat_unidades,
            mat_unit_measure: request.mat_unit_measure,
            mat_id: request.mat_id,
            mat_image: ''
        }

        materialService.update(material).then(result => {
            if (typeof result == 'boolean')
                return res.status(200).send({ message: 'query error', status: 'error', data: [] });

            return res.json({ message: 'Material Actualizado', status: 'ok', data: [] })
        });

    } catch (ex) {
        console.log(ex.stack);
        return res.status(200).send({ error: "catch error", status: 'error', data: [] });
    }
}

controller.delete = (req, res) => {
    try {
        let matID = req.query.mat_id;

        if (!matID)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        materialService.delete({ mat_id: matID }).then(result => {
            if (typeof result == 'boolean')
                return res.status(200).send({ message: 'query error', status: 'error', data: [] });

            return res.json({ message: 'Material eliminado', status: 'ok', data: result })
        });
    } catch (ex) {
        console.log(ex.stack);
        return res.status(200).send({ error: "catch error", status: 'error', data: [] });
    }
}

controller.getAll = (req, res) => {
    materialService.find([], {}).then(result => {
        if (typeof result == 'boolean')
            return res.status(200).send({ message: 'query error', status: 'error', data: [] });

        return res.json({ message: 'ok', status: 'ok', data: result })
    });
}

controller.getMatID = (req, res) => {
    try {
        let matID = req.query.mat_id;

        if (!matID)
            return res.status(400).send({ message: 'faltan datos', status: 'error', data: [] });

        materialService.find([], { mat_id: matID }).then(result => {
            if (typeof result == 'boolean')
                return res.status(200).send({ message: 'query error', status: 'error', data: [] });

            return res.json({ message: 'ok', status: 'ok', data: result })
        });
    } catch (ex) {
        console.log(ex.stack);
        res.status(200).send({ message: 'Este material no existe', status: 'error', data: [] });
    }
}

module.exports = controller;