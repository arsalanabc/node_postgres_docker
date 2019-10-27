'use strict';
require('dotenv').config({ path: '.env'});
process.env.NODE_ENV='testing'

const controller = require('../../src/controllers/ShoeController');

const chai = require('chai')
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;

const response = chai.spy();
chai.spy.on(response, ['send','status']);

describe('ShoeController specs', () => {
    after(() => {
        const client = require('../../src/db');
        client.query('TRUNCATE shoes CASCADE;')
    });
    describe('/insert', () => {
        it('should call shoe model\'s insert method', async () => {
            await controller.insert(()=>{}, response, {shoeModel:'shoe1'})
            await controller.insert(()=>{}, response, {shoeModel:'shoe2'})
            await controller.insert(()=>{}, response, {shoeModel:'shoe3'})
            await controller.insert(()=>{}, response, {shoeModel:'shoe4'})
            expect(response.send).to.have.been.called(4);
        });

        it('should throw an error  with invalid data', async () => {
            await controller.insert(()=>{}, response, {wrongKey:'shoe1'})
            expect(response.status).on.nth(1).be.called.with(500);
        });
    });

    describe('/addSize', () => {
        it('should call shoe model\'s addSize method', async () => {
            await controller.addSize(()=>{}, response, {shoeModel:'shoe1', size:'3'})
            await controller.addSize(()=>{}, response, {shoeModel:'shoe1', size:'2'})
            expect(response.send).to.have.been.called(6);
        });

        it('should throw an error with invalid data', async () => {
            // expect(response.status).to.have.been.called.exactly(2);
            await controller.addSize(()=>{}, response, {shoeModel:'doesntExist', size:'3'})
            expect(response.send).on.nth(7).be.called.with('Error: Size was not inserted');
        });

        it('should throw an error with invalid data 2', async () => {
            await controller.addSize(()=>{}, response, {a:'', b:''})
            expect(response.status).on.nth(2).be.called.with(500);
        });
    });

    describe('/trueToSize', () => {
        it('should add new size', async () => {
            const expectedTrueToSize = (2+3+5+1+3)/5;//calc from values inserted in previous tests
            await controller.insert(()=>{}, response, {shoeModel:'newShoe'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe', size:'2'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe', size:'3'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe', size:'5'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe', size:'1'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe', size:'3'})

            await controller.trueToSize(()=>{}, response,'newShoe')
            expect(response.send).on.nth(14).be.called.with(`true to size for newShoe is ${expectedTrueToSize}`);
        });

        it('should show a message for shoe not found', async () => {
            await controller.trueToSize(()=>{}, response,'doestExistShoe')
            expect(response.send).on.nth(15).be.called.with('Shoe not found');
        });
    });
});