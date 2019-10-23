'use strict'
const client = require('../db');

const Shoe = {
    insert: (shoe) => {
        try {
            client.query('INSERT INTO shoes (model) VALUES ($1)',
                [shoe.model]);
            return `${shoe.model} inserted in the table shoes`;
        } catch (e) {
            client.query('ROLLBACK')
            throw e
        }
    },
    get: async () =>
        {return await client.query('select * from shoes');},

    addModelSize: async (data) => {
        const insert_size_query = 'INSERT INTO size_data (shoe_model, size) VALUES ($1, $2)';

        try {
            client.query(
                'SELECT id from shoes WHERE model=$1 limit 1',
                [data.shoeModel],
                async (err, res) => {
                    const shoe_id = res.rows[0].id;

                    await client.query(insert_size_query,
                        [shoe_id, data.size]);
                    return 'size inserted in the table size_data';
                });

        } catch (e) {
            client.query('ROLLBACK')
            throw e
        }
    },
    trueToSizeCalculation: async (shoeModel) => {
            const query = 'SELECT avg(sd.size) FROM size_data as sd JOIN shoes as s ON s.id=sd.shoe_model WHERE s.model=$1';
            return await client.query(query, [shoeModel]);
        }
}

module.exports = Shoe;

