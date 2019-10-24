'use strict'
const shoe = require('../models/Shoe');

const controller = {
    insert: (req, response, data) => {
        shoe.insert({model: data.shoeModel})
            .then(data =>
                data
                    ?response.send('Shoe model inserted')
                    :response.status(500).send('Error: Shoe model was not inserted'))
            .catch(err => console.log(err)); // catch promise rejection
    },
    get: (req, response) => {
         shoe.get()
             .then(data =>
                 data
                     ?response.send(data.rows)
                     :response.status(500).send('Error: Could\'nt get data'))
             .catch(err => console.log(err)); // catch promise rejection
    },
    addSize: (req, response, data) => {
        shoe.addModelSize(data)
            .then(data =>
                data
                    ?response.send('Size inserted')
                    :response.status(500).send('Error: Size was not inserted'))
            .catch(err => console.log(err)); // catch promise rejection
    },
    trueToSize : (req, response, shoeModel) => {
        shoe.trueToSizeCalculation(shoeModel)
            .then(data => {
                return !data?response.send("Error: No data return"):data.rows[0]
            })
            .then(data => {
                data.avg!=null
                    ?response.send(`true to size for ${shoeModel} is ${data.avg}`)
                    :response.send("Shoe not found")})
            .catch(err => console.log(err)) // catch promise rejection
    }
}

module.exports = controller;