module.exports = function (app) {
    var controller = require('../../controllers/report/fund.controller');
    app.get('/fund01', controller.fund01);
}

