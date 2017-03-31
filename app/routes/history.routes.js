module.exports = function (app) {
    var controller = require('../controllers/history.controller');
    app.get('/unapprove', controller.unapprove);
    app.get('/', controller.listHistory);
    app.post('/request', controller.requestWelfare); ///request/welfare/
    app.put('/update/approve', controller.updateApproveWelfare); ///update/welfare/
    app.put('/update/reject', controller.updateRejectWelfare); ///update/welfare/
    app.get('/file/:id', controller.listUploadHistory); ///list/upload/history/:id
    app.post('/approve', controller.adminApprove);
}