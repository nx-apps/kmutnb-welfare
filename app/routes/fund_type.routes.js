module.exports = function (app) {
    var controller = require('../controllers/fund_type.controller');
    app.get('/', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}