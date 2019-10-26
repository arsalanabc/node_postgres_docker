'use strict';
require('dotenv').config({ path: '.env'});
process.env.NODE_ENV='testing'

const shoe = require('../../src/models/Shoe');

const chai = require('chai')
const expect = chai.expect;

const shoe_models = [{model:'shoeModel1'},{model:'shoeModel2'},{model:'shoeModel3'},{model:'shoeModel4'}]

describe('Shoe', () => {

    after(() => {
        const client = require('../../src/db');
        client.query('TRUNCATE shoes CASCADE;')
        client.end();
    });
    describe('/insert', () => {
        it('should insert shoe models to db', async () => {
            const model1 = await shoe.insert({model:'shoeModel1'})
            const model2 = await shoe.insert({model:'shoeModel2'})
            const model3 = await shoe.insert({model:'shoeModel3'})
            const model4 = await shoe.insert({model:'shoeModel4'})
            expect(model1).to.be.true
            expect(model2).to.be.true
            expect(model3).to.be.true
            expect(model4).to.be.true

            const result = await shoe.get();
            expect(result.rows).to.be.length(4);
            expect(result.rows[0].model).to.contain(shoe_models[0].model);
            expect(result.rows[1].model).to.contain(shoe_models[1].model);
            expect(result.rows[2].model).to.contain(shoe_models[2].model);
            expect(result.rows[3].model).to.contain(shoe_models[3].model);
        });
    });

    describe('/addModelSize', () => {
        it('should add size for shoe models 1', async () => {
            const size1 = {shoeModel:shoe_models[1].model, size:1}
            const size2 = {shoeModel:shoe_models[1].model, size:1}
            const size3 = {shoeModel:shoe_models[1].model, size:4}
            const size4 = {shoeModel:shoe_models[1].model, size:1}

            const model1 = await shoe.addModelSize(size1)
            const model2 = await shoe.addModelSize(size2)
            const model3 = await shoe.addModelSize(size3)
            const model4 = await shoe.addModelSize(size4)

            expect(model1).to.be.true
            expect(model2).to.be.true
            expect(model3).to.be.true
            expect(model4).to.be.true
        });

        it('should add size for shoe models 2', async () => {
            const size1 = {shoeModel:shoe_models[2].model, size:4}
            const size2 = {shoeModel:shoe_models[2].model, size:3}
            const size3 = {shoeModel:shoe_models[2].model, size:4}
            const size4 = {shoeModel:shoe_models[2].model, size:5}
            const size5 = {shoeModel:shoe_models[2].model, size:1}
            const size6 = {shoeModel:shoe_models[2].model, size:2}

            const model1 = await shoe.addModelSize(size1)
            const model2 = await shoe.addModelSize(size2)
            const model3 = await shoe.addModelSize(size3)
            const model4 = await shoe.addModelSize(size4)
            const model5 = await shoe.addModelSize(size5)
            const model6 = await shoe.addModelSize(size6)

            expect(model1).to.be.true
            expect(model2).to.be.true
            expect(model3).to.be.true
            expect(model4).to.be.true
            expect(model5).to.be.true
            expect(model6).to.be.true
        });
    });

    describe('/trueToSizeCalculation', () => {
        it('should calc truetosize for a shoe model', async () => {
            let expectedTrueToSize = (1+1+4+1)/4;//calc from values inserted in previous tests

            let trueToSize = await shoe.trueToSizeCalculation(shoe_models[1].model);
            let valueFromDB = trueToSize.rows[0].avg
            expect(valueFromDB-expectedTrueToSize).to.equal(0)

            expectedTrueToSize = (4+3+4+5+1+2)/6;//calc from values inserted in previous tests

            trueToSize = await shoe.trueToSizeCalculation(shoe_models[2].model);
            valueFromDB = trueToSize.rows[0].avg
            expect(valueFromDB-expectedTrueToSize).to.equal(0)
        });
    });

});