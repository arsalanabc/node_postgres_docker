'user strict'
const shoeController = require('../controllers/ShoeController');
function routes(app) {
    app.get('/', (req, res) => res.send("welcome to True to Size app"));
    app.get('/shoe/insert/:name', (req, res) => {
        const shoeModel = req.params.name;
        shoeController.insert(req, res, {shoeModel})
    });
    app.get('/:shoe/addsize/:size', (req, res) => {
        const shoeModel = req.params.shoe;
        const size = req.params.size;

        (size <= 0 || size > 5)?
            res.send('Please enter size between 0 and 5 inclusive')
            :shoeController.addSize(req, res, {shoeModel, size})
    });
    app.get('/:shoe/truetosize', (req, res) => {
        const shoeModel = req.params.shoe;
        shoeController.trueToSize(req, res, shoeModel)
    });
    app.get('/get', (req, res) => shoeController.get(req, res));
}

module.exports = routes;