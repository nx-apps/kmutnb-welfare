module.exports = function (app) {
    var controller = require('../controllers/document.controller');
    app.get('/list/file/', controller.listFilePath);
     app.delete('/delete/:id', controller.deleteFile);
}