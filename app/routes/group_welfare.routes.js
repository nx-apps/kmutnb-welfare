module.exports = function (app) {
    var controller = require('../controllers/group_welfare.controller');
    app.get('/year', controller.groupYear);
    app.get('/:id', controller.listId);
    app.get('/:year', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}