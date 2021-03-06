module.exports = function (app) {
    var controller = require('../controllers/excel.controller');
    app.get('/read', controller.read);
    app.get('/write', controller.write);
    app.get('/wel2emp', controller.wel2emp);
    app.get('/emp2wel', controller.emp2wel);
    app.get('/reduce', controller.reduce);
    app.get('/param', controller.param);
    app.get('/fund', controller.fund);
    app.get('/sso', controller.sso);
    app.get('/groupJasper',controller.gJasper);
}