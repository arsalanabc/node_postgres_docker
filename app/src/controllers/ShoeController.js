'use strict'
const shoe = require('../models/Shoe');

const controller = {
    insert: (req, response, data) => {
        const result =  shoe.insert({model: data.shoeModel});
        response.send(result);
    },
    get: (req, response) => {
         shoe.get()
             .then(data => {return data.rows})
             .then(data => response.send(data));
    },
    addSize: (req, response, data) => {
        shoe.addModelSize(data)
            .then(data => response.send(data));
    },
    trueToSize : (req, response, shoeModel) => {
        shoe.trueToSizeCalculation(shoeModel)
            .then(data => {return data.rows[0]})
            .then(data => {
                data.avg!=null
                    ?response.send(`true to size for ${shoeModel} is ${data.avg}`)
                    :response.send("Shoe not found")});
    }
}

module.exports = controller;