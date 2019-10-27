'use strict';
require('dotenv').config({path: '.env.test'});

console.log(process.env.APP_URL)
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
            try {
                await controller.insert(()=>{}, response, {wrongKey:'shoe1'})
            } catch (e) {
                expect(e.message).to.equal('missing argument')
                expect(response.status).on.nth(1).be.called.with(200);
            }
        });

        it('should throw an error for duplicate shoe models', async () => {
            try {
                await controller.insert(()=>{}, response, {shoeModel:'shoe1'})
            } catch (e) {
                expect(response.status).to.be.called(2);
                expect(e.message).to.equal('Shoe Model already exists')
                expect(response.status).to.be.called(2);

            }
        });
    });

    describe('/addSize', () => {
        it('should call shoe model\'s addSize method', async () => {
            await controller.addSize(()=>{}, response, {shoeModel:'shoe1', size:'3'})
            await controller.addSize(()=>{}, response, {shoeModel:'shoe1', size:'2'})
            expect(response.send).to.have.been.called(7);
        });

        it('should throw an error with invalid data', async () => {
            // expect(response.status).to.have.been.called.exactly(2);
            await controller.addSize(()=>{}, response, {shoeModel:'doesntExist', size:'3'})
            expect(response.send).on.nth(8).be.called.with('Size was not inserted');
        });

        it('should throw an error with invalid data 2', async () => {
            await controller.addSize(()=>{}, response, {a:'', b:''})
            expect(response.status).on.nth(2).be.called.with(200);
        });
    });

    describe('/trueToSize', () => {
        it('should add new size', async () => {
            const expectedTrueToSize = (2+3+5+1+3)/5;//calc from values inserted in previous tests
            await controller.insert(()=>{}, response, {shoeModel:'newShoe101'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe101', size:'2'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe101', size:'3'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe101', size:'5'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe101', size:'1'})
            await controller.addSize(()=>{}, response, {shoeModel:'newShoe101', size:'3'})

            await controller.trueToSize(()=>{}, response,'newShoe101')
            expect(response.send).on.nth(15).be.called.with(`true to size for newShoe101 is ${expectedTrueToSize}`);
        });

        it('should show a message for shoe not found', async () => {
            await controller.trueToSize(()=>{}, response,'doestExistShoe')
            expect(response.send).on.nth(16).be.called.with('Shoe not found');
        });
    });
});