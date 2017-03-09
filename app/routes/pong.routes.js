module.exports = function (app) {
    var controller = require('../controllers/pong.controller');
    app.get('/welfares', controller.welfares);
    app.get('/welfare/:id', controller.welById);
    app.get('/employees', controller.employees);
    app.get('/changeValue', controller.changeValue);
    app.get('/adminWelfare/:year', controller.adminWelfare);
}