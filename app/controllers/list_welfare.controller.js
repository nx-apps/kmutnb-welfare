exports.listWelfare = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.listWelfareId = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .merge(function (m) {
            return {
                start_date: m('start_date').split('T')(0),
                end_date: m('end_date').split('T')(0)
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
}