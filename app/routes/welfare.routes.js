module.exports = function (app) {
    var controller = require('../controllers/welfare.controller');
    app.get('/', controller.list);
    app.get('/:id', controller.listId);
}