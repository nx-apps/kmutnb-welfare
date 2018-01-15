exports.currentdate = function (req, res) {
    let result = new Date()
    let day = 1000 * 60 * 60 * 24;
    let _7day_old = 7 * day
    let now = +new Date(result)
    //    console.log(((+new Date(result))-_7day_old).toISOString())
    //    var date = 
    let date = {
        result: result,
        dateOld_7: (new Date(now - _7day_old)).toISOString(),
        dateNow: +new Date(result),
        date: result.toISOString(),
        dates: result.toISOString().split('T')[0],
        day: result.toISOString().split('T')[0].split('-')[2],
        month: result.toISOString().split('T')[0].split('-')[1],
        year: result.toISOString().split('T')[0].split('-')[0],
    }

    res.json(date);
}
exports.listyear = function (req, res) {
    // var cutYear = function(db,table){
    //     return r.db(db).table(table).group('year')
    //         .ungroup()
    //         .merge((item) => {
    //             return {
    //                 year: item('group')
    //             }
    //         })
    //         .pluck('year')
    //         .coerceTo('array')
    // }
    const r = req.r
    r.expr({
        history_welfare_year: r.db('welfare').table('history_welfare')
            .pluck('date_use')
            .merge((item) => {
                return {
                    year: item('date_use').year()
                }
            })
            .group('year')
            .ungroup()
            .merge((item) => {
                return {
                    year: item('group')
                }
            })
            .pluck('year')
            .orderBy(r.desc('year'))
            .coerceTo('array'),
        history_sso_year: r.db('welfare').table('history_sso')
            .pluck('issued_date')
            .merge((mer_oneTime) => {
                return {
                    year: mer_oneTime('issued_date').year(),
                }
            })
            .group('year')
            .ungroup()
            .merge((item) => {
                return {
                    year: item('group')
                }
            })
            .pluck('year')
            .orderBy(r.desc('year'))
            .coerceTo('array'),
        history_fund_year: r.db('welfare').table('history_fund')
            .pluck('fund_year').group('fund_year')
            .ungroup()
            .merge((item) => {
                return {
                    year: item('group')
                }
            })
            .pluck('year')
            .orderBy(r.desc('year'))
            .coerceTo('array')
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}