'use strict';


describe('vacations rights admin rest service', function() {


    var server;

    /**
     * A right ID created during the tests
     */
    var right;


    beforeEach(function(done) {

        var helpers = require('../mockServer');

        helpers.mockServer(function(_mockServer) {
            server = _mockServer;
            done();
        });
    });


    it('verify the mock server', function(done) {
        expect(server.app).toBeDefined();
        done();
    });


    it('request rights list as anonymous', function(done) {
        server.get('/rest/admin/rights', {}, function(res) {
            expect(res.statusCode).toEqual(401);
            done();
        });
    });


    it('Create admin session', function(done) {
        server.createAdminSession().then(function() {
            done();
        });
    });


    it('request rights list as admin', function(done) {
        server.get('/rest/admin/rights', {}, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body.length).toBeDefined(); // Others rights can be created by some tests
            done();
        });
    });


    it('create new right with a quantity', function(done) {
        server.post('/rest/admin/rights', {
            name: 'Rest right test',
            quantity: 25,
            quantity_unit: 'D'
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();

            right = body._id;

            done();
        });
    });



    it('create new right with empty quantity', function(done) {
        server.post('/rest/admin/rights', {
            name: 'Rest right test with empty quantity',
            quantity: 0,
            quantity_unit: 'D'
        }, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toBeDefined();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();
            done();
        });
    });



    it('fail to create new right with wrong quantity unit', function(done) {
        server.post('/rest/admin/rights', {
            name: 'Rest right test with wrong quantity unit',
            quantity: 0,
            quantity_unit: 'Z'
        }, function(res, body) {
            expect(res.statusCode).toEqual(400);
            expect(body._id).toBeUndefined();
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeFalsy();

            done();
        });
    });



    it('get the created right', function(done) {

        expect(right).toBeDefined();

        server.get('/rest/admin/rights/'+right, {}, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body.name).toEqual('Rest right test');
            expect(body.quantity).toEqual(25);
            expect(body.quantity_unit).toEqual('D');
            expect(body._id).toEqual(right);
            done();
        });
    });

    it('delete the created right', function(done) {
        server.delete('/rest/admin/rights/'+right, function(res, body) {
            expect(res.statusCode).toEqual(200);
            expect(body._id).toEqual(right);
            expect(body.name).toEqual('Rest right test');
            expect(body.$outcome).toBeDefined();
            expect(body.$outcome.success).toBeTruthy();
            done();
        });
    });


    it('logout', function(done) {
        server.get('/rest/logout', {}, function(res) {
            expect(res.statusCode).toEqual(200);
            done();
        });
    });


    it('close the mock server if no more uses', function() {
        server.closeOnFinish();
    });


});
