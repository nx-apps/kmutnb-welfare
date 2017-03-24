exports.getRvdFund = function (req, res) {

    var r = req.r;
    r.db('welfare').table('rvd_signup').getAll(req.params.pid, { index: 'personal_id' })
        .merge((group_name) => {
            return r.db('welfare').table('rvd').get(group_name('rvd_id')).without('id')

        })
        .merge((date)=>{
            return {
                date_signup : date('date_signup').split('T')(0)
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}