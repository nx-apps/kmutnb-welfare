module.exports = function (app) {
    var controller = require('../controllers/welfare.controller');
    app.get('/', controller.welfare);
    app.get('/:id', controller.welfareId);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}