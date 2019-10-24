'use strict'
const client = require('../db');

const Shoe = {
    insert: async (shoe) => {
            return await client.query(
                'INSERT INTO shoes (model) VALUES ($1)',
                [shoe.model])
                .then(res => {
                    return res.rowCount>0?true:false;
                })
                .catch(e => {
                    console.error(e);
                    return false;
                });
    },
    get: async () => {
        return await client.query('select * from shoes')
            .then(res => {
                return res;
            })
            .catch(e => {
                console.error(e);
                return false;
            });
        },

    addModelSize: async (data) => {
        return await client.query(
            'SELECT id from shoes WHERE model=$1 limit 1',
            [data.shoeModel])
            .then(result => {
                const shoe_id = result.rows[0].id;

                const insert_size_query = 'INSERT INTO size_data (shoe_model, size) VALUES ($1, $2)';
                return client.query(insert_size_query,
                    [shoe_id, data.size])
            })
            .then(res => {
                return res.rowCount>0?true:false;
            })
            .catch(e => {
                console.error(e);
                return false;
            });
        },
    trueToSizeCalculation: async (shoeModel) => {
            const query = 'SELECT avg(sd.size) FROM size_data as sd JOIN shoes as s ON s.id=sd.shoe_model WHERE s.model=$1';
            return await client.query(query, [shoeModel])
                .then(res => {
                    return res;
                })
                .catch(e => {
                    console.error(e);
                    return false;
                });
        }
}

module.exports = Shoe;

