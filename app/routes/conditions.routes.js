module.exports = function (app) {
    var controller = require('../controllers/conditions.controller');
    // app.get(['/', '/list'], controller.read); //list
    app.get('/table', controller.listTable); //listTable
    app.get('/field', controller.listField); //listField
    app.get(['/', '/list'], controller.conditions); //list/conditions
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}