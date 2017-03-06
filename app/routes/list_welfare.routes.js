module.exports = function (app) {
    var controller = require('../controllers/list_welfare.controller');
    app.get('/', controller.listWelfare);
    app.get('/:id', controller.listWelfareId);
}