module.exports = function (app) {
    var controller = require('../controllers/group_welfare.controller');
    app.get('/', controller.list);
    app.get('/:id', controller.listId);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}