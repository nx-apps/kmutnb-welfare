module.exports = function (app) {
    var controller = require('../controllers/history.controller');
    app.get('/emp/:emp_id', controller.historyEmp);
    app.get('/unapprove', controller.unapprove);
    app.get('/search', controller.listHistory);
    app.post('/request', controller.requestWelfare); ///request/welfare/
    app.put('/update/approve', controller.updateApproveWelfare); ///update/welfare/
    app.put('/update/reject', controller.updateRejectWelfare); ///update/welfare/
    app.put('/update/cancel', controller.updateCancelWelfare);
    app.get('/file/:id', controller.listUploadHistory); ///list/upload/history/:id
    app.post('/approve', controller.adminApprove);
    app.get('/list/welfare', controller.listWelfare);
    app.get('/list/fund', controller.listFund);
    app.get('/list/sso', controller.listSso);
    // app.post('/rvd', controller.useRvd);
    app.put('/rejectrvd', controller.rejectRvd);
    app.post('/usegroup', controller.usegroup);
    
}