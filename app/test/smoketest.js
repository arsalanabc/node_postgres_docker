'use strict';

const chai = require('chai')
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

describe('/' , () => {
    it('succeeds as expected', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/')
            .end(function(err, res) {
                expect(res.text).to.equal('welcome to True to Size app');
                expect(res).to.have.status(200);
                done();
            });
    });

    it('fails to reach not found route as expected', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/noroute')
            .end(function(err, res) {
                expect(res.text).to.contains('Cannot GET /noroute');
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('/get' , () => {
    it('returns an array of {}', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/get')
            .end(function(err, res) {
                expect(res.body).to.be.an('array');
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('/shoe/insert/:name' , () => {
    it('adds a new shoe model through http', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/shoe/insert/WhateverShoeName')
            .end(function(err, res) {
                expect(res.text).to.equal('Shoe model inserted');
                expect(res).to.have.status(200);
                done();
            });
    });

    it('handles insert shoe route without shoe name', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/shoe/insert/')
            .end(function(err, res) {
                expect(res.text).to.contains('Cannot GET /shoe/insert/');
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe('/:shoe/addsize/:size' , () => {
    it('adds a size for shoe through http', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/shoe/insert/newmodel')
            .then(() => {
                chai.request('http://localhost:3000')
                    .get('/newmodel/addsize/1')
                    .end(function(err, res) {
                        expect(res.text).to.equal('Size inserted');
                        expect(res).to.have.status(200);
                        done();
                    });
            })
    });

    it('fails to add a size for shoe not found', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/shoe_doesnt_exist/addsize/1')
            .end(function(err, res) {
                expect(res.text).to.equal('Size was not inserted');
                expect(res).to.have.status(200);
                done();
            });
    });

    it('fails to add a size out of range', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/shoe/insert/newmodel')
            .then(() => {
                chai.request('http://localhost:3000')
                    .get('/newmodel/addsize/10')
                    .end(function(err, res) {
                        expect(res.text).to.equal('Please enter size between 0 and 5 inclusive');
                        expect(res).to.have.status(200);
                        done();
                    });
            })
    });
});

describe('/:shoe/truetosize' , () => {
    it('request truetosize via http', (done) => { // <= Pass in done callback
         chai.request('http://localhost:3000')
            .get('/shoe/insert/randomShoe')
            .then(() => {
                chai.request('http://localhost:3000')
                    .get('/newmodel/truetosize')
                    .end(function (err, res) {
                        expect(res.text).to.contains('true to size for newmodel is');
                        expect(res).to.have.status(200);
                        done();
                    });
            });
    });

    it('shows error for requesting true to size for unknown shoe', (done) => { // <= Pass in done callback
        chai.request('http://localhost:3000')
            .get('/shoe doesnt exist/truetosize')
            .end(function (err, res) {
                expect(res.text).to.contains('Shoe not found');
                expect(res).to.have.status(200);
                done();
            });
    });
});