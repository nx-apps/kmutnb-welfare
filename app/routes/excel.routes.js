module.exports = function (app) {
    var controller = require('../controllers/excel.controller');
    app.get('/read', controller.read);
    app.get('/test', controller.test);
    app.get('/write', controller.write);
}