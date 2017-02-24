module.exports = function (app) {
    var controller = require('../controllers/pong.controller');
    app.get('/read', controller.read);
}