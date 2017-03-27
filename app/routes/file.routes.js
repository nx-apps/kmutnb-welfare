module.exports = function (app) {
    var controller = require('../controllers/file.controller');
    app.get('/download/:id', controller.downloadFile);
    app.post('/:emp_id/upload/', controller.uploadFile);
    app.post('/admin/:emp_id/history/file/:history_id', controller.uploadFileadmin);
}