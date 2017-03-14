module.exports = function (app) {
    var controller = require('../controllers/user.controller');
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);

    app.get('/unapprove', controller.unapprove);
    // app.get('/id/:id/welfares/year/:year', controller.welfares);
    app.get('/welfares/year/:year/id/:id', controller.welfares);
    app.post('/use/welfare/', controller.useWelfare);
    // app.post('/use_welfare', controller.useWelfare);
    app.put('/use_welfare/update', controller.editWelfare);
    app.delete('/use_welfare/delete/id/:id', controller.deleteWelfare);


}