module.exports = function (app) {
    var controller = require('../controllers/user_welfare.controller');
    app.get('/', controller.list);
    app.get('/:id', controller.listId);
}