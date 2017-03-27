module.exports = function (app) {
    var controller = require('../controllers/file.controller');
    app.get('/download/:id', controller.downloadFile);
    app.post('/upload/:emp_id', controller.uploadFile);
    app.post('/admin/:emp_id/:history_id', controller.uploadFileadmin); //admin/:emp_id/history/file/:history_id
}