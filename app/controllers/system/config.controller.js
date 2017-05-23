exports.readSystemConfig = function (req, res) {

    var r = req.r;
    r.db('welfare').table('system_config')
        .run()
        .then(function (result) {
            res.json(result[0]);
        })
        .error(function (err) {
            res.json(err);
        })
    //    res.json(date);
}
exports.updateSystemConfig = function (req, res) {
    let data = ''

    var r = req.r;
    r.db('welfare').table('system_config')
        .update(req.body)
        .run()
        .then(function (result) {
            // let nunm = result.replaced > 0 && result.unchanged === 0
            // console.log(result);
            // console.log(result.replaced);
            // console.log(result.replaced > 0 );
            // console.log(result.unchanged);
            // console.log(nunm);
            res.json(result);
        })
        .error(function (err) {
            res.json(err);
        })
}