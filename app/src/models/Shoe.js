'use strict'
const client = require('../db');
const logger = require('log4js').getLogger('ShoeModel');
const errorsLogger = require('log4js').getLogger('errors');

const Shoe = {
    insert: async (shoe = null) => {
        if(shoe == null || typeof shoe.model != 'string') {
            throw Error('missing argument');
        };
        const query = 'INSERT INTO shoes (model) VALUES ($1)';
        logger.info(`Executing: ${query}`);
        return await client.query(
            query,
            [shoe.model])
            .then(res => {
                logger.info(`Query finished: ${query}`);
                return res.rowCount>0?true:false;
            })
            .catch(e => {
                errorsLogger.fatal(e);
                throw e;
            });
    },
    get: async () => {
        const query = 'select * from shoes';
        logger.info(`Executing: ${query}`);
        return await client.query(query)
            .then(res => {
                logger.info(`Data returned for: ${query}`);
                return res;
            })
            .catch(e => {
                errorsLogger.fatal(e);
                throw e;
            });
        },
    addModelSize: async (data = null) => {
        if(data == null || !('shoeModel' in data) || !('size' in data)){
            throw Error('Invalid arguments');
        }
        const query = 'SELECT id from shoes WHERE model=$1 limit 1';
        const insert_size_query = 'INSERT INTO size_data (shoe_model, size) VALUES ($1, $2)';
        logger.info(`Executing: ${query}`);
        return await client.query(
             query,
            [data.shoeModel])
            .then(result => {
                if(result.rowCount==0) return false;
                logger.info(`Data returned for: ${query}`);
                const shoe_id = result.rows[0].id;
                logger.info(`Executing: ${insert_size_query}`);
                return client.query(insert_size_query,
                    [shoe_id, data.size])
            }).then(res => {
                logger.info(`Query finished: ${insert_size_query}`);
                return res.rowCount>0?true:false;
            })
            .catch(e => {
                errorsLogger.fatal(e);
                throw e;
            });
    },
    trueToSizeCalculation: async (shoeModel = null) => {
        if(shoeModel===null) {
            throw Error('missing argument');
        };
        const query = 'SELECT avg(sd.size) FROM size_data as sd JOIN shoes as s ON s.id=sd.shoe_model WHERE s.model=$1';
        logger.info(`Executing: ${query}`);
        return await client.query(query, [shoeModel])
            .then(res => {
                logger.info(`Data returned for: ${query}`);
                return res;
            })
            .catch(e => {
                errorsLogger.fatal(e);
                throw e;
            });
        }
}

module.exports = Shoe;

