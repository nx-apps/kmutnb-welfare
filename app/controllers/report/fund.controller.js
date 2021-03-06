var checkLogic = function (select, row,r) {
    return r.branch(
        select('logic').eq('=='),
        row(select('field_name')).eq(select('value')),
        select('logic').eq('>'),
        row(select('field_name')).gt(select('value')),
        select('logic').eq('>='),
        row(select('field_name')).ge(select('value')),
        select('logic').eq('<'),
        row(select('field_name')).lt(select('value')),
        select('logic').eq('<='),
        row(select('field_name')).le(select('value')),
        row(select('field_name')).ne(select('value'))
    )
};
var getEmployee = function (emp, con,r) {
    var countCon = con.count();
    return r.branch(countCon.gt(1),
        con.reduce(function (left, right) {
            return r.branch(left.hasFields('data'),
                {
                    data: left('data').filter(function (f) {
                        return checkLogic(right, f,r)
                    })
                },
                {
                    data: emp.filter(function (f) {
                        return checkLogic(left, f,r)
                    }).filter(function (f) {
                        return checkLogic(right, f,r)
                    })
                }
            )
        })('data'),
        countCon.eq(1),
        emp.filter(function (f) {
            return checkLogic(con(0), f,r)
        }),
        emp
    )
};
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
var arr_month = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

function getMonth(month,req) {
    var r = req.r;
    return r.expr(["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'])(month)
}

function keysToUpper(param) {
    var keyname = Object.keys(param);
    for (var i = 0; i < keyname.length; i++) {
        param[keyname[i].toUpperCase()] = param[keyname[i]];
        delete param[keyname[i]];
    }
    return param;
}

exports.fund01 = function (req, res) {
    // var r = req.r;
    // var param = req.query;
    // param.monthName = "";
    // if (param.year !== undefined)
    //     param.year = Number(param.year)
    // if (param.month !== undefined) {
    //     param.month = Number(param.month)
    //     param.monthName = arr_month[param.month]
    // }

    // r.db('welfare').table('history_fund')//.getAll(param.req.year, { index: 'year' })
    //     // .filter({ 'personal_id': param.personal_id })
    //     // // .getAll(param.personal_id, { index: 'personal_id' })
    //     .filter({
    //         fund_year: param.year, fund_month: param.month
    //     })
    //     .orderBy('fund_code')
    //     .run()
    //     .then(function (result) {
    //         // res.json(result);
    //         param = keysToUpper(param);
    //         CURRENT_DATE = new Date().toISOString().slice(0, 10)
    //         param.CURRENT_DATE = CURRENT_DATE
    //         res.ireport("fund01.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);

    var r = req.r;
    var param = req.query;
    param.monthName = "";
    if (param.year !== undefined)
        param.year = Number(param.year)
    if (param.month !== undefined) {
        param.month = Number(param.month)
        param.monthName = arr_month[param.month]
    }
    // console.log(param)
    var data = r.db('welfare').table('history_fund');//;
    if (param.policy_code === undefined && param.month === undefined) {
        data = data.getAll(param.year, { index: 'fund_year' })
        // res.json(1)
    } else if (param.policy_code !== undefined && param.month === undefined) {
        data = data.getAll([param.year, param.policy_code], { index: 'yearPolicy' })
        // res.json(2)
    } else if (param.policy_code !== undefined && param.month !== undefined) {
        data = data.getAll([param.year, param.month, param.policy_code], { index: 'yearMonthPolicy' })
        // res.json(3)
    } else if (param.policy_code === undefined && param.month !== undefined) {
        data = data.getAll([param.year, param.month], { index: 'yearMonth' })
        // res.json(4)
    }
    r.expr({
        data: data.coerceTo('array')
            // r.db('welfare').table('history_fund').limit(20)
            .group(function (g) {
                return g.pluck('fund_company', 'fund_name', 'policy_code')
            })
            .ungroup()
            .map(function (m) {
                return m('group').merge(function (mer) {
                    return m('reduction').group('personal_id').ungroup().map(function (m2) {
                        return m('group').merge({
                            personal_id: m2('group'),
                            emp_name: m2('reduction')('emp_name')(0),
                            fund_uname: m2('reduction')('fund_uname')(0),
                            com_con: m2('reduction').sum('com_con'),
                            com_ear: m2('reduction').sum('com_ear'),
                            emp_con: m2('reduction').sum('emp_con'),
                            emp_ear: m2('reduction').sum('emp_ear'),
                            total: m2('reduction').sum('total')
                        })
                    })
                })
            })
            .reduce(function (left, right) {
                return left.add(right)
            })
            .orderBy('fund_company', 'fund_name', 'policy_code')
        // data: data.coerceTo('array').limit(10).group('personal_id').ungroup()//.count()
        //     //.limit(20)//.orderBy('fund_code')
        //     // .filter({ policy_code : param.policy_code,
        //     //          fund_year: param.year,
        //     //          fund_month : param.month
        //     //  })
        //     // .getAll([param.year, param.month], { index: 'yearMonth' })
        //     .merge(function (m2) {
        //         return {
        //             com_con: m2('reduction').sum('com_con'),
        //             com_ear: m2('reduction').sum('com_ear'),
        //             emp_con: m2('reduction').sum('emp_con'),
        //             emp_ear: m2('reduction').sum('emp_ear'),
        //             emp_name: m2('reduction')('emp_name')(0),
        //             policy_code: m2('reduction')('policy_code')(0),
        //             personal_id: m2('reduction')('personal_id')(0),
        //             total: m2('reduction').sum('total'),
        //             // fund_name: m2('reduction')('fund_name')(0),
        //             // fund_company: m2('reduction')('fund_company')(0),
        //             // fund_uname: m2('reduction')('fund_uname')(0),
        //         }
        //     })
        //     .orderBy('personal_id')
        // // .without('reduction')
    })
        .merge(function (m) {
            return {
                params: r.branch(m('data').count().gt(0),
                    m('data')(0).pluck('fund_name', 'fund_company', 'fund_uname'),
                    {}
                )
            }
        })

        .run()
        .then(function (data) {
            // // var param = data['params'];
            // var result = data['data'];
            // res.json(data);
            data['params'] = Object.assign(param, data['params']);
            data['params'] = keysToUpper(data['params']);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            // res.json(data['params']);
            res.ireport("fund01.jasper", req.query.EXPORT || req.query.export || "pdf", data['data'], data['params']);
        });

}
exports.fund02 = function (req, res) {
    var r = req.r;
    var param = req.query;
    param.monthName = "";
    if (param.year !== undefined)
        param.year = Number(param.year)
    if (param.month !== undefined) {
        param.month = Number(param.month)
        param.monthName = arr_month[param.month]
    }
    r.expr({
        data: r.db('welfare').table('history_fund')
            .getAll([param.year, param.personal_id], { index: 'yearPID' })
            .merge({ fund_month: getMonth(r.row('fund_month'),req) })//.orderBy('fund_month')
            .coerceTo('array')
    })
        .merge(function (m) {
            return {
                params: r.branch(m('data').count().gt(0),
                    m('data')(0).pluck('fund_name', 'fund_company', 'fund_uname', 'emp_name'),
                    {}
                )
            }
        })
        .run()
        .then(function (data) {
            // // var param = data['params'];
            // var result = data['data'];
            // res.json(data);
            data['params'] = Object.assign(param, data['params']);
            data['params'] = keysToUpper(data['params']);
            // res.json(data['params']);
            res.ireport("fund02.jasper", req.query.EXPORT || req.query.export || "pdf", data['data'], data['params']);
        })
}
exports.sso = function (req, res) {
    var r = req.r;
    var param = req.query;
    // param.year = Number(param.year) + 543;
    // param.monthName = "";
    // if (param.year !== undefined)
    //     param.year = Number(param.year)
    // if (param.month !== undefined) {
    //     param.month = Number(param.month)
    //     param.monthName = arr_month[param.month]
    // }
    r.db('welfare').table('history_sso').getAll(param.personal_id, { index: 'personal_id' })
        .merge(function (name_merge) {
            return {
                employee_name: name_merge('prefix_name').add(name_merge('first_name'))
                    .add('  ', name_merge('last_name')),
                expired_date: name_merge('expired_date').toISO8601().split('T')(0),
                issued_date: name_merge('issued_date').toISO8601().split('T')(0)
            }
        })
        // .merge(function (time_merge) {
        //     return {
        //         AA: time_merge('expired_date').toISO8601().split('T')(0)
        //     }
        // })
        .run()
        .then(function (result) {
            // res.json(result);
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("sso.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        })
}