module.exports = function (app) {
    var controller = require('../controllers/user.controller');
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
}