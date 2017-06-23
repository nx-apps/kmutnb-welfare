module.exports = function (app) {
    var controller = require('../../controllers/report/fund.controller');
    app.get('/fund01', controller.fund01);
    app.get('/fund02', controller.fund02);
    app.get('/sso', controller.sso);
}

