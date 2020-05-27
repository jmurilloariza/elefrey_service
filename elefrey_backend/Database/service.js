class Service {

    constructor(columns, tablename, primaryKeys) {
        this.cassandra = require('./database');
        this.columns = columns;
        this.tablename = tablename;
        this.primaryKeys = primaryKeys;
    }

    save(model, if_not_exist) {
        return new Promise((resolve, reject) => {
            if_not_exist == undefined ? if_not_exist = '' : if_not_exist = 'if not exists';

            let query = `insert into ${this.tablename} (`;
            let keys = Object.keys(model);
            let values = Object.values(model);

            if (!keys.every(element => this.columns.indexOf(element) > -1)) {
                console.log('Los parametros enviados no cohinciden con las columnas de la table polaris_core_user.' + this.tablename)
                resolve(false);
            }

            if (!this.primaryKeys.every(element => model.hasOwnProperty(element)) || this.primaryKeys.length == 0) {
                console.log('Para insert debe especificar minimo las llaves primarias.')
                resolve(false);
            }

            if (keys.length > 0) {
                query += keys.join(', ') + ' ) values (';

                let aux = new Array(keys.length);
                query += aux.join('?, ') + '? )' + if_not_exist;
            }

            this.cassandra.execute(query, values).then(result => {
                resolve(result);
            });
        });
    }

    update(model, if_exist, parametersOther) {
        return new Promise((resolve, reject) => {
            if_exist == undefined || if_exist == false ? if_exist = '' : if_exist = 'IF EXISTS';
            let primarys = [];
            let query = `update ${this.tablename} `;

            this.primaryKeys.forEach(key => {
                if (model.hasOwnProperty(key)) {
                    let primary_key = model[key];
                    delete model[key];
                    primarys.push(primary_key);
                }
            });

            let keys = Object.keys(model);
            let values = Object.values(model);

            values = values.concat(primarys);

            if (!keys.every(element => this.columns.indexOf(element) > -1)) {
                console.log('Los parametros enviados no cohinciden con las columnas de la table polaris_core_user.' + this.tablename)
                resolve(false);
            }

            if (keys.length > 0) {
                query += 'set ' + keys.join(' = ?, ') + ' = ? where ' +
                    this.primaryKeys.join(' = ? and ') + ' = ?' + if_exist;
            }

            if (parametersOther != undefined && parametersOther.length > 0) {
                if (keys.length <= 0) query = query + ' where ';
                let n = parametersOther.length;
                let and = '';

                keys.length > 0 ? and = 'and' : and = '';
                query = `${query} ${and}`;

                parametersOther.forEach((value, index) => {
                    if (index + 1 == n)
                        query = `${query} ${value[0]} ${value[1]} ? `;
                    else query = `${query} ${value[0]} ${value[1]} ? and`;

                    values.push(value[2]);
                });
            }

            this.cassandra.execute(query, values).then(result => {
                resolve(result);
            });
        });
    }

    find(selects, parameters, parametersOther, limit) {
        return new Promise((resolve) => {
            let query = 'select ';
            let keys = Object.keys(parameters);
            let values = Object.values(parameters);

            if (!keys.every(element => this.columns.indexOf(element) > -1)) {
                console.log('Los parametros enviados no cohinciden con las columnas de la table polaris_core_user.' + this.tablename)
                resolve(false);
            }

            if (selects.length == 0) query = query + '*'
            else query += selects.join(' , ');

            query += ` from ${this.tablename} `;

            if (keys.length > 0) {
                query += ' where ' + keys.join(' = ? and ') + ' = ? ';
            }

            if (parametersOther != undefined && parametersOther.length > 0) {
                if (keys.length <= 0) query = query + ' where ';
                let n = parametersOther.length;
                let and = '';

                keys.length > 0 ? and = 'and' : and = '';
                query = `${query} ${and}`;

                parametersOther.forEach((value, index) => {
                    if (index + 1 == n)
                        query = `${query} ${value[0]} ${value[1]} ? `;
                    else query = `${query} ${value[0]} ${value[1]} ? and`;

                    values.push(value[2]);
                });
            }

            if (keys.length > 0 || (parametersOther != undefined && parametersOther.length > 0))
                query = query + ' allow filtering';

            console.log(query, values);


            if (limit != undefined && limit == true) {
                this.cassandra.executeGetNotLimit(query, values).then(result => {
                    resolve(result);
                });
            } else {
                this.cassandra.executeQueryGet(query, values).then(result => {
                    resolve(result);
                });
            }
        });
    }

    delete(parameters) {
        return new Promise((resolve) => {
            let query = `delete from ${this.tablename}`;
            query += ` where ${this.primaryKeys.join(' = ? and ')}` + ' = ?';

            this.cassandra.execute(query, parameters).then(result => {
                resolve(result);
            });
        });
    }

    getById(ids) {
        return new Promise((resolve, reject) => {
            let query = `select * from ${this.tablename}`;
            query += ` where ${this.primaryKeys.join(' = ? and ')}` + ' = ?';

            this.cassandra.executeQueryGet(query, ids).then(result => {
                resolve(result);
            });
        });
    }

    saveBatch(models, if_not_exist) {
        return new Promise((resolve) => {

            if_not_exist == undefined ? if_not_exist = '' : if_not_exist = 'if not exists';
            let queries = [];

            models.forEach(model => {
                let query = `insert into ${this.tablename} (`;
                let keys = Object.keys(model);
                let values = Object.values(model);

                if (!keys.every(element => this.columns.indexOf(element) > -1)) {
                    console.log('Los parametros enviados no cohinciden con las columnas de la table polaris_core_user.' + this.tablename)
                    resolve(false);
                }

                if (!this.primaryKeys.every(element => model.hasOwnProperty(element)) || this.primaryKeys.length == 0) {
                    console.log('Para insert debe especificar minimo las llaves primarias.')
                    resolve(false);
                }

                if (keys.length > 0) {
                    query += keys.join(', ') + ' ) values (';

                    let aux = new Array(keys.length);
                    query += aux.join('?, ') + '? )' + if_not_exist;
                }
                queries.push({
                    query: query,
                    params: values
                });

            });

            this.cassandra.batch(queries).then(result => {
                resolve(result);
            });

        });
    }

    updateBatch(models) {
        return new Promise((resolve) => {
            let queries = [];

            models.forEach(model => {
                let query = `update ${this.tablename} `;
                let primarys = [];

                this.primaryKeys.forEach(key => {
                    if (model.hasOwnProperty(key)) {
                        let primary_key = model[key];
                        delete model[key];
                        primarys.push(primary_key);
                    }
                });

                let keys = Object.keys(model);
                let values = Object.values(model);

                values = values.concat(primarys);

                if (!keys.every(element => this.columns.indexOf(element) > -1)) {
                    console.log('Los parametros enviados no cohinciden con las columnas de la table polaris_core_user.' + this.tablename)
                    resolve(false);
                }

                if (keys.length > 0) {
                    query += 'set ' + keys.join(' = ?, ') + ' = ? where ' +
                        this.primaryKeys.join(' = ? and ') + ' = ?';
                }

                queries.push({
                    query: query,
                    params: values
                });

            });

            this.cassandra.batch(queries).then(result => {
                resolve(result);
            });
        })
    }

    deleteBatch(parameters) {
        return new Promise((resolve) => {
            let query = `delete from ${this.tablename}`;
            query += ` where ${this.primaryKeys.join(' = ? and ')}` + ' = ?';

            const queries = parameters.map((value) => {
                return {
                    query: query,
                    params: value
                }
            });

            this.cassandra.batch(queries).then(result => {
                resolve(result);
            });
        })

    }
}

module.exports = Service