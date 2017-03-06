module.exports = function (app) {
    var controller = require('../controllers/list_welfare.controller');
    app.get('/', controller.listWelfare);
    app.get('/:id', controller.listWelfareId);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}