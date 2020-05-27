let methods = {};
const conection = require('../Database/conection');

methods.executeQueryGet = (query, parameters) => {
    return new Promise((resolve, reject) => {
        methods.execute(query, parameters).then(result => {
            if (typeof result != 'boolean')
                resolve(result.rows);
            else resolve(result)
        });
    });
}

methods.execute = (query, parameters) => {
    return new Promise((resolve, reject) => {
        try {
            conection.execute(query, parameters, { prepare: true }, (err, result) => {
                if (err) {
                    console.log(err.stack);
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        } catch (ex) {
            console.log(ex.stack);
            resolve(false);
        }
    });
}

methods.batch = (queries) => {
    return new Promise((resolve, reject) => {
        try {
            conection.batch(queries, { prepare: true }, (err, result) => {
                if (err) {
                    console.log(err.stack);
                    resolve(false);
                } else {
                    resolve(result);
                }
            })
        } catch (ex) {
            console.log(ex.stack);
            resolve(false);
        }
    });
}

module.exports = methods;