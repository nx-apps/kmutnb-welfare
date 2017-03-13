module.exports = function (app) {
    var controller = require('../controllers/user_welfare.controller');
    app.get('/', controller.list);
    app.get('/id/:id', controller.listId);
    app.get('/groupYear', controller.groupYear);
    app.get('/groupByYear/year/:year', controller.groupByYear);
    app.get('/adminEmployee/:welId', controller.adminEmployee);
    app.get('/welfaresEmployee/:id', controller.welfaresEmployee);
}