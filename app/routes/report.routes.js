module.exports = function (app) {
    var controller = require('../controllers/report.controller');
    app.get('/report1/:id',controller.report1);
    app.get('/report2',controller.report2);
    app.get('/report3',controller.report3);
}

