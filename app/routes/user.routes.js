module.exports = function (app) {
    var controller = require('../controllers/user.controller');
    app.get('/list', controller.list);
    app.get('/welfares/id/:id', controller.welfares);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);
}