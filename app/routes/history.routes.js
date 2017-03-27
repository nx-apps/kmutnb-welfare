module.exports = function (app) {
    var controller = require('../controllers/history.controller');
    app.get('/unapprove', controller.unapprove);
    app.post('/request/welfare/', controller.requestWelfare);
    app.put('/update/welfare/', controller.updateWelfare);
    app.get('/list/upload/history/:id', controller.listUploadHistory);
}