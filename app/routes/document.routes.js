module.exports = function (app) {
    var controller = require('../controllers/document.controller');
    app.get('/path', controller.listFilePath); ///list/file/
    app.delete('/delete/:id', controller.deleteFile);
}