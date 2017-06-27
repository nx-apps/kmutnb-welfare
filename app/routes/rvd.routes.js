module.exports = function (app) {
    var controller = require('../controllers/rvd.controller');
    app.get('/', controller.list);
    app.get('/genfile',controller.genFund);
    app.get('/id/:id', controller.listId);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}