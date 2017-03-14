module.exports = function (app) {
    var controller = require('../controllers/user.controller');
    app.get('/list', controller.list);
    app.post('/insert', controller.insert);
    app.put('/update', controller.update);
    app.delete('/delete/:id', controller.delete);

    app.get('/unapprove', controller.unapprove);
    app.get('/:id/welfares/year/:year', controller.welfares);
    // app.get('/welfares/year/:year/id/:id', controller.welfares);
    app.post('/request/welfare/', controller.requestWelfare);
    app.put('/update/welfare/', controller.updateWelfare);

    // app.delete('/use_welfare/delete/id/:id', controller.deleteWelfare);


}