'use strict'
const proxyquire =  require('proxyquire').noCallThru();

const sinon = require('sinon');
const chai = require('chai');
const spies = require('chai-spies');

chai.use(spies);

const expect = chai.expect;

describe("Shoe", () => {

    const db = {query: () => {}} ;

    const Shoe = proxyquire('../../src/models/Shoe', {
        '../db': db
    });

    beforeEach('stub db class', () => {
        sinon
            .stub(db, 'query')
            .returns(Promise.resolve(true));
    });

    afterEach(() => {
        sinon.restore();
    });


    describe("should have all the required methods", ()=>{
        it('has the get function', ()=>{
            expect(Shoe.get).to.be.a('function');
        });
        it('has the insert function', ()=>{
            expect(Shoe.insert).to.be.a('function');
        });
        it('has the truetosize function', ()=>{
            expect(Shoe.trueToSizeCalculation).to.be.a('function');
        });
        it('has the addsize function', ()=>{
            expect(Shoe.addModelSize).to.be.a('function');
        });
    });

    describe('get method', ()=>{
        it('should return a promise', ()=>{
            const get = Shoe.get();
            expect(get.then).to.be.a('function');
            expect(get.catch).to.be.a('function');
        });

        it('should use db client and call query',()=>{
            chai.spy.on(db, ['query']);
            chai.spy.on(db.query(), ['then']);
            Shoe.get();
            expect(db.query().then).to.have.been.called(1);
            expect(db.query).to.have.been.called.with('select * from shoes');
        });
    });
    describe('insert method', ()=>{
        it('should return a promise', () => {
            const insert = Shoe.insert().then().catch(e => e);
            expect(insert.then).to.be.a('function');
            expect(insert.catch).to.be.a('function');

        });
        it('should throw error for missing argument', async () => {
            try {
                await Shoe.insert(1);
            } catch (err) {
                expect(err.message).to.eql('missing argument')
            }
        });

        it('should take a string model name', async () => {
            try {
                await Shoe.insert();
            } catch (err) {
                expect(err.message).to.eql('missing argument')
            }
        });
        it('should use db client and call query', () => {
            chai.spy.on(db, ['query']);
            Shoe.insert('shoeModel')
            expect(db.query).to.have.been.called.with('INSERT INTO shoes (model) VALUES ($1)');
            expect(db.query).to.have.been.called(1);
        });
    });

    describe('addModelSize method', ()=>{
        it('should return a promise', () => {
            const addModelSize = Shoe.addModelSize().then().catch(e => e);
            expect(addModelSize.then).to.be.a('function');
            expect(addModelSize.catch).to.be.a('function');
        });
        it('should throw error for invalid data', async () => {
            try {
                await Shoe.addModelSize();
            } catch (err) {
                expect(err.message).to.eql('Invalid arguments')
            }
        });

        it('should throw error for invalid data', async () => {
            try {
                await Shoe.addModelSize({a:'', b:'',c:''});
            } catch (err) {
                expect(err.message).to.eql('Invalid arguments')
            }
        });

        it('should use db client and call query', async () => {
            chai.spy.on(db, ['query']);
            Shoe.addModelSize({shoeModel:'', size:''})
            expect(db.query).to.have.been.called.with('SELECT id from shoes WHERE model=$1 limit 1');
            expect(db.query).to.have.been.called(1);
        });
    });

    describe('trueToSizeCalculation method', ()=>{
        it('should return a promise', () => {
            const addModelSize = Shoe.trueToSizeCalculation().then().catch(e => e);
            expect(addModelSize.then).to.be.a('function');
            expect(addModelSize.catch).to.be.a('function');
        });

        it('should throw error for missing argument', () => {
            return Shoe.trueToSizeCalculation()
                .then(() => {expect.fail()})
                .catch(err => expect(err.message).to.eql('missing argument'));
        });

        it('should use db client and call query', () => {
            chai.spy.on(db, ['query']);
            Shoe.trueToSizeCalculation('shoeModel');
            expect(db.query).to.have.been.called.with('SELECT avg(sd.size) FROM size_data as sd JOIN shoes as s ON s.id=sd.shoe_model WHERE s.model=$1');
            expect(db.query).to.have.been.called(1);

        });
    });
});