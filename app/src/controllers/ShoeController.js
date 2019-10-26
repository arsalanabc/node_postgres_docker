'use strict'
const shoe = require('../models/Shoe');
const logger = require('log4js').getLogger('ShoeController');
const exceptionsLogger = require('log4js').getLogger('exceptions');

const controller = {
    insert: (req, response, data) => {
        logger.info('shoe/insert endpoint reached')
        return shoe.insert({model: data.shoeModel})
            .then(data =>
                data
                    ?response.send('Shoe model inserted')
                    :response.send('Error: Shoe model was not inserted')
            )
            .catch(err => {
                exceptionsLogger.error(err)
                response.status(500)
            }); // catch promise rejection

    },
    get: (req, response) => {
        logger.info('get endpoint reached')
         return shoe.get()
             .then(data =>
                 data
                     ?response.send(data.rows)
                     :response.send('Error: Could\'nt get data'))
             .catch(err => { // catch promise rejection
                 exceptionsLogger.error(err)
                 response.status(500);
             });
    },
    addSize: (req, response, data) => {
        logger.info('addsize endpoint reached')
        return shoe.addModelSize(data)
            .then(data =>
                data
                    ?response.send('Size inserted')
                    :response.send('Error: Size was not inserted'))
            .catch(err => {
                exceptionsLogger.log(err)
                response.status(500);
            }); // catch promise rejection
    },
    trueToSize : (req, response, shoeModel) => {
        logger.info('truetosize endpoint reached')
        return shoe.trueToSizeCalculation(shoeModel)
            .then(data => {
                return !data?response.send("Error: No data return"):data.rows[0]
            })
            .then(data => {
                data.avg!=null
                    ?response.send(`true to size for ${shoeModel} is ${data.avg}`)
                    :response.send("Shoe not found")})
            .catch(err => {
                exceptionsLogger.log(err)
                response.status(500);}) // catch promise rejection
    }
}

module.exports = controller;