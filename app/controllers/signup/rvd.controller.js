exports.getrvd = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup').getAll(req.params.pid, { index: 'personal_id' })
        .eqJoin('rvd_id', r.db('welfare').table('rvd'))
        .without({ right: ['id'] })
        .zip()
        .merge((date)=> {
            return {
                date_signup : date('date_signup').split('T')(0)
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
}
