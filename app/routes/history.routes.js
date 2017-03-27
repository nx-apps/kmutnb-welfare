module.exports = function (app) {
    var controller = require('../controllers/history.controller');
    app.get('/unapprove', controller.unapprove);
    app.post('/request', controller.requestWelfare); ///request/welfare/
    app.put('/update', controller.updateWelfare); ///update/welfare/
    app.get('/file/:id', controller.listUploadHistory); ///list/upload/history/:id
}