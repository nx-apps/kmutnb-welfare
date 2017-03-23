module.exports = function (app) {
    var controller = require('../../controllers/group/fund.controller');
    app.get('/year/:year', controller.list);
    app.get('/id/:id', controller.listId);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
    app.get('/year', controller.groupYear);
}