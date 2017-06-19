module.exports = function (app) {
    var controller = require('../../controllers/report/welfare.controller');
    app.get('/report1/:id',controller.report1);
    app.get('/welfare1',controller.welfare1);
    app.get('/welfare2',controller.welfare2);
    app.get('/welfare3',controller.welfare3);
    app.get('/welfare4',controller.welfare4);
    app.get('/welfare5',controller.welfare5);
    app.get('/welfare6',controller.welfare6);
    app.get('/welfare7',controller.welfare7);
    app.get('/welfare8',controller.welfare8);
    app.get('/welfare9',controller.welfare9);
    app.get('/employee',controller.employee);
    app.get('/emp_welfare',controller.emp_welfare);
    app.get('/retire',controller.retire);
    app.get('/welfare10',controller.welfare10);
    app.get('/group_health',controller.group_health);
}

