module.exports = function (app) {
    var controller = require('../controllers/conditionreadwelfare.controller');
    app.get('/list', controller.read);
    app.get('/listTable', controller.listTable);
    app.get('/list/conditions', controller.conditions);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}