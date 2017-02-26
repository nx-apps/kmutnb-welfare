module.exports = function (app) {
    var controller = require('../controllers/user.controller');
    app.get('/read', controller.read);
}