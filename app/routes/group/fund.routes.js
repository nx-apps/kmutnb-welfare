module.exports = function (app) {
    var controller = require('../../controllers/group/fund.controller');
    app.get('/year/:year', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/id/:id', controller.delete);
}