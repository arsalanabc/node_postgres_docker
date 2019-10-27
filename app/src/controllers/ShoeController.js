'use strict'
const shoe = require('../models/Shoe');
const logger = require('log4js').getLogger('ShoeController');
const exceptionsLogger = require('log4js').getLogger('exceptions');

const controller = {
    insert: (req, response, data) => {
        logger.info('shoe/insert endpoint reached')
        return shoe.insert({model: data.shoeModel})
            .then(result =>
                result
                    ?response.send('Shoe model inserted')
                    :response.send('Shoe model was not inserted')
            )
            .catch(err => {
                exceptionsLogger.error(err)
                switch (err.code) {
                    case '23505':
                        response.status(200)
                        response.send('Shoe Model already exists');
                        throw Error('Shoe Model already exists')
                        break;
                    default:
                        response.status(200);
                        throw err;
                }
            }); // catch promise rejection

    },
    get: (req, response) => {
        logger.info('get endpoint reached')
         return shoe.get()
             .then(result =>
                 result
                     ?response.send(result.rows)
                     :response.send('Error: Could\'nt get data'))
             .catch(err => { // catch promise rejection
                 exceptionsLogger.error(err)
                 response.status(500);
                 throw err
             });
    },
    addSize: (req, response, data) => {
        logger.info('addsize endpoint reached')
        return shoe.addModelSize(data)
            .then(result =>
            {result
                    ?response.send('Size inserted')
                    :response.send('Size was not inserted')})
            .catch(err => {
                exceptionsLogger.log(err)
                response.status(500);
            }); // catch promise rejection
    },
    trueToSize : (req, response, shoeModel) => {
        logger.info('truetosize endpoint reached')
        return shoe.trueToSizeCalculation(shoeModel)
            .then(result => {
                return !result?response.send("Error: No data return"):result.rows[0]
            })
            .then(data => {
                data.avg!=null
                    ?response.send(`true to size for ${shoeModel} is ${data.avg*1.0}`)
                    :response.send("Shoe not found")})
            .catch(err => {
                exceptionsLogger.log(err)
                response.status(500);}) // catch promise rejection
    }
}

module.exports = controller;