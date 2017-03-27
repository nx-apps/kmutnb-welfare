module.exports = function (app) {
    var controller = require('../controllers/document.controller');
    app.get('/list/file/', upload.listFilePath);
     app.delete('/delete/:id', upload.deleteFile);
}