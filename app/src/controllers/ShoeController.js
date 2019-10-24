'use strict'
const shoe = require('../models/Shoe');
const logger = require('log4js').getLogger('ShoeController');
const exceptionsLogger = require('log4js').getLogger('exceptions');

const controller = {
    insert: (req, response, data) => {
        logger.info('shoe/insert endpoint reached')
        shoe.insert({model: data.shoeModel})
            .then(data =>
                data
                    ?response.send('Shoe model inserted')
                    :response.status(500).send('Error: Shoe model was not inserted')
            )
            .catch(err => {
                exceptionsLogger.error(err)
            }); // catch promise rejection
    },
    get: (req, response) => {
        logger.info('get endpoint reached')
         shoe.get()
             .then(data =>
                 data
                     ?response.send(data.rows)
                     :response.status(500).send('Error: Could\'nt get data'))
             .catch(err => { // catch promise rejection
                 exceptionsLogger.error(err)
             });
    },
    addSize: (req, response, data) => {
        logger.info('addsize endpoint reached')
        shoe.addModelSize(data)
            .then(data =>
                data
                    ?response.send('Size inserted')
                    :response.status(500).send('Error: Size was not inserted'))
            .catch(err => exceptionsLogger.log(err)); // catch promise rejection
    },
    trueToSize : (req, response, shoeModel) => {
        logger.info('truetosize endpoint reached')
        shoe.trueToSizeCalculation(shoeModel)
            .then(data => {
                return !data?response.send("Error: No data return"):data.rows[0]
            })
            .then(data => {
                data.avg!=null
                    ?response.send(`true to size for ${shoeModel} is ${data.avg}`)
                    :response.send("Shoe not found")})
            .catch(err => exceptionsLogger.log(err)) // catch promise rejection
    }
}

module.exports = controller;