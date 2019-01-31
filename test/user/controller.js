/**
 * Created by titilope on 1/31/2019.
 */
/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    users = require('../../app/controllers/users'),
    routes = require("../../config/routes"),
    index = require("../../app/controllers/index");

//Globals
var request = {
    body: {
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password',
        avatar: '1'
    }
};

var res = {
    viewName: "",
    data: {},
    render: function (view, viewData) {
        this.viewName = view;
        this.data = viewData;
    },
    redirect: function (view) {
        this.viewName = view;
    }
};


//The tests
describe("Routing", function () {
        describe("Signup Route success", function () {
            it("should redirect to home page route", function (done) {
                users.apicreate(request, res);
                console.log(res);
                res.viewName.should.not.equal("/#!/signup?error=incomplete");
                done();
            });
        });
        describe("Signup Route fail", function () {
            it("should redirect to incomplete signup route", function (done) {
                request.body.name = '';
                request.body.email = '';
                users.apicreate(request, res);
                 console.log('hey', res);
                res.viewName.should.equal("/#!/signup?error=incomplete");
                done();
            });
        });
        describe("home page", function () {
            it("should render index page", function (done) {
                index.render(request, res);
                res.viewName.should.equal("index");
                done();
            });
        });
        describe("play app redirect", function () {
            it("should render play app page for non custom user", function (done) {
                request.query = [{custom:''}];
                index.play(request, res);
                res.viewName.should.equal("/#!/app");
                done();
            });
        });
});





