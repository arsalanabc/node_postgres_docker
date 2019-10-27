'use strict'
const proxyquire =  require('proxyquire').noCallThru();
const sinon = require('sinon');
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;

const response = chai.spy();
const testData = {shoeModel:'test'}
chai.spy.on(response, ['send','status']);

describe("ShoeController", () => {
    const shoe = {insert:()=>{}} ;
    const shoeController = proxyquire('../../src/controllers/ShoeController', {
        '../models/Shoe': shoe
    });

    describe("should have all the routes", ()=>{
        it('has the insert function', ()=>{
            chai.expect(shoeController.insert).to.be.a('function');
        });
        it('has the truetosize function', ()=>{
            chai.expect(shoeController.trueToSize).to.be.a('function');
        });
        it('has the addsize function', ()=>{
            chai.expect(shoeController.addSize).to.be.a('function');
        });
        it('has the get function', ()=>{
            chai.expect(shoeController.get).to.be.a('function');
        });
    });

    describe("/insert",  ()=>{

        it('calls Shoe insert with success', async () => {
            sinon.stub(shoe, 'insert').returns(Promise.resolve(true));
            chai.spy.on(shoe, ['insert']);

            await shoeController.insert(()=>{}, response, testData)

            expect(shoe.insert).to.have.been.called(1);
            expect(shoe.insert).to.have.been.called.with({model: testData.shoeModel})
            expect(response.send).to.have.been.called(1);
        });

        it('handles errors', async () => {
            sinon.stub(shoe, 'insert').rejects(Error('error'));
            try {
                await shoeController.insert(()=>{}, response, testData)
            } catch (e) {
                expect(shoe.insert).to.have.been.called(1);
                expect(shoe.insert).to.have.been.called.with({model: testData.shoeModel})
                expect(response.send).to.have.been.called(1);
                expect(response.status).to.have.been.called(1).with(200)
                expect(e.message).to.equal('error');
            }
        });
    });
    describe("/get",  ()=>{
        shoe.get = () => {}
        beforeEach(() => {
            sinon.restore()
        })

        it('calls Shoe Get with success', async () => {
            sinon.stub(shoe, 'get').returns(Promise.resolve(true));
            chai.spy.on(shoe, ['get']);
            chai.spy.on(shoe.get(), ['then']);

            await shoeController.get(()=>{}, response)

            expect(shoe.get).to.have.been.called(2);
            expect(shoe.get().then).to.have.been.called(1);
            expect(response.send).to.have.been.called(2);
        });

        it('calls Shoe get with failure', async () => {
            sinon.stub(shoe, 'get').returns(Promise.resolve(false));
            chai.spy.on(shoe, ['get']);
            await shoeController.get(()=>{}, response, testData)

            expect(shoe.get).to.have.been.called(1);
            expect(response.send).to.have.been.called(3)
        });
    });

    describe("/addSize",  ()=>{
        shoe.addModelSize = () => {}
        const testData = {shoeModel:'', size:''}
        beforeEach(() => {
            sinon.restore()
        })
        it('calls Shoe addModelSize with success', async () => {
            sinon.stub(shoe, 'addModelSize').returns(Promise.resolve(true));
            chai.spy.on(shoe, ['addModelSize']);

            await shoeController.addSize(()=>{}, response, testData)

            expect(shoe.addModelSize).to.have.been.called(1);
            expect(shoe.addModelSize).to.have.been.called.with(testData)
            expect(response.send).to.have.been.called(4);
        });

        it('calls Shoe addModelSize with failure', async () => {
            sinon.stub(shoe, 'addModelSize').returns(Promise.reject(false));
            chai.spy.on(shoe, ['addModelSize']);

            await shoeController.addSize(()=>{}, response, testData)

            expect(shoe.addModelSize).to.have.been.called(1);
            expect(shoe.addModelSize).to.have.been.called.with(testData)
            expect(response.send).to.have.been.called(4);
            expect(response.status).to.have.been.called(2).with(500)
        });
    });

    describe("/trueToSize",  ()=>{
        shoe.trueToSizeCalculation = () => {}
        beforeEach(() => {
            sinon.restore()
        })
        it('calls Shoe trueToSizeCalculation with success', async () => {
            sinon.stub(shoe, 'trueToSizeCalculation').returns(Promise.resolve(true));
            chai.spy.on(shoe, ['trueToSizeCalculation']);

            await shoeController.trueToSize(()=>{}, response, 'testData')

            expect(shoe.trueToSizeCalculation).to.have.been.called(1);
            expect(shoe.trueToSizeCalculation).to.have.been.called.with('testData')
            expect(response.send).to.have.been.called(4);
        });

        it('calls trueToSizeCalculation for shoe not found', async () => {
            sinon.stub(shoe, 'trueToSizeCalculation').returns(Promise.resolve(false));
            chai.spy.on(shoe, ['trueToSizeCalculation']);

            await shoeController.trueToSize(()=>{}, response, 'testData')

            expect(shoe.trueToSizeCalculation).to.have.been.called(1);
            expect(shoe.trueToSizeCalculation).to.have.been.called.with('testData')
            expect(response.send).to.have.been.called(5);
        });

        it('calls Shoe trueToSizeCalculation with failure', async () => {
            sinon.stub(shoe, 'trueToSizeCalculation').returns(Promise.reject(false));
            chai.spy.on(shoe, ['trueToSizeCalculation']);

            await shoeController.trueToSize(()=>{}, response, "testData")

            expect(shoe.trueToSizeCalculation).to.have.been.called(1);
            expect(shoe.trueToSizeCalculation).to.have.been.called.with("testData")
            expect(response.send).to.have.been.called(5);
            expect(response.status).to.have.been.called(5).with(500)
        });
    });
});