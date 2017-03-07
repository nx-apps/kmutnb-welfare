module.exports = function (app) {
    var controller = require('../controllers/common.controller');
    // app.get('/read', controller.read);
    app.get('/academic', controller.academic);
    app.get('/active', controller.active);
    app.get('/department', controller.department);
    // app.get('/employee', controller.employee);
    app.get('/faculty', controller.faculty);
    app.get('/gender', controller.gender);
    app.get('/matier', controller.matier);
    app.get('/position', controller.position);
    app.get('/prefixname', controller.prefixname);
    app.get('/relation', controller.relation);
    app.get('/type_employee', controller.type_employee);
}