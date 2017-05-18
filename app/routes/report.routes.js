module.exports = function (app) {
    var controller = require('../controllers/report.controller');
    app.get('/report1/:id',controller.report1);
    app.get('/report11/:id',controller.report11);
    app.get('/report2',controller.report2);
    app.get('/report2_1',controller.report2_1);
    app.get('/report3',controller.report3);
    app.get('/report3_1',controller.report3_1);
    app.get('/report4/:year',controller.report4);
    app.get('/report4_1/:year',controller.report4_1);
    app.get('/report4_2/:year',controller.report4_2);
    app.get('/report5',controller.report5);
    app.get('/report5_1',controller.report5_1);
    app.get('/report6', controller.report6);
    app.get('/list_group/:id', controller.list_group);
    app.get('/list_year/:year', controller.list_year);
    app.get('/report_test/:year', controller.report_test);
}

