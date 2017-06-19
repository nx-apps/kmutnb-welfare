var checkLogic = function (select, row) {
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
var getEmployee = function (emp, con) {
    var countCon = con.count();
    return r.branch(countCon.gt(1),
        con.reduce(function (left, right) {
            return r.branch(left.hasFields('data'),
                {
                    data: left('data').filter(function (f) {
                        return checkLogic(right, f)
                    })
                },
                {
                    data: emp.filter(function (f) {
                        return checkLogic(left, f)
                    }).filter(function (f) {
                        return checkLogic(right, f)
                    })
                }
            )
        })('data'),
        countCon.eq(1),
        emp.filter(function (f) {
            return checkLogic(con(0), f)
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

function keysToUpper(param) {
    var keyname = Object.keys(param);
    for (var i = 0; i < keyname.length; i++) {
        param[keyname[i].toUpperCase()] = param[keyname[i]];
        delete param[keyname[i]];
    }
    return param;
}

exports.fund01 = function (req, res) {
    var r = req.r;
    var param = req.query;
    // var parameters = {
    //     CURRENT_DATE: new Date().toISOString().slice(0, 10)
    // };
    r.db('welfare').table('history_fund').getAll([2017, 4], { index: 'yearMonth' })
        .run()
        .then(function (result) {
            // res.json(result);
            // if (req.query.res_type == 'json') {
            //     res.json(result);
            // }
            // if (result.length > 0) {
            //     param.employee_name = result[0].name;
            // }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("fund01.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}