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
exports.report1 = function (req, res, next) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\'
    };
    var emps = r.db('welfare').table('employee').without('dob').coerceTo('array');
    r.db('welfare').table('welfare').get(req.params.id)//.coerceTo('array')
        .merge(function (wel_merge) {
            var conditions = wel_merge('condition');
            var employeeFilter = getEmployee(emps, conditions,r);
            return {
                group_welfare_name: r.db('welfare').table('group_welfare').get(wel_merge('group_id')).getField('group_welfare_name'),
                count_employee: employeeFilter.count(),
                employee: employeeFilter.pluck('personal_id', 'firstname', 'gender_name', 'lastname', 'department_name',
                    'faculty_name', 'prefix_name', 'start_work_date', 'type_employee_name')
                    .merge(function (add_name) {
                        return {
                            name: add_name('prefix_name').add(add_name('firstname'), add_name('lastname')),
                            department_fuculty_name: add_name('department_name').add(' ', add_name('faculty_name'))
                        }
                    })
                    .without('prefix_name', 'firstname', 'lastname', 'department_name', 'faculty_name')
            }
        })
        .without('condition')
        .run()
        .then(function (result) {
            // res.json(result);
            res.ireport("report1.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.welfare1 = function (req, res) {
    var r = req.r

    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    r.db('welfare').table('history_welfare')
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true, 'group_id': param.group_id })
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck("left", { right: 'group_welfare_name' }).zip()
        .eqJoin('emp_id', r.db('welfare').table('employee')).pluck("left", { right: ['type_employee_id', 'faculty_id', 'department_id'] }).zip()
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck("left", { right: 'type_employee_name' }).zip()
        .group('group_id').ungroup()
        .merge(function (m) {
            return {
                group_welfare_name: m('reduction')('group_welfare_name')(0),
                reduction1: m('reduction')
                    .group('type_employee_id').ungroup()
                    .merge(function (s) {
                        return {
                            sum_budget_use: s('reduction').sum('budget_use'),
                            type_employee_name: s('reduction')('type_employee_name')(0)
                        }
                    })
                    .without('reduction')
            }
        }).without('reduction')
        .merge(function (n) {
            return {
                sum_budget: n('reduction1').sum('sum_budget_use')
            }
        })
        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("welfare1.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare2 = function (req, res) {
    var r = req.r

    // var year = req.query.year;//2017
    // var month = req.query.month;//03
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    r.db('welfare').table('history_welfare')
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true })
        .filter({ 'group_id': param.group_id })
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck("left", { right: 'group_welfare_name' }).zip()
        .eqJoin('emp_id', r.db('welfare').table('employee')).pluck("left", { right: ['type_employee_id', 'faculty_id', 'department_id'] }).zip()
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck("left", { right: 'type_employee_name' }).zip()
        //.filter({ 'type_employee_id': param.type_employee_id })
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck("left", { right: 'faculty_name' }).zip()
        .group('group_id').ungroup()
        .merge(function (m) {
            return {
                group_welfare_name: m('reduction')('group_welfare_name')(0),
                reduction: m('reduction')
                    .group('faculty_id').ungroup()
                    .merge(function (s) {
                        return {
                            sum_budget_use: s('reduction').sum('budget_use'),
                            faculty_name: s('reduction')('faculty_name')(0)
                        }
                    })
                //.without('reduction')
            }
        })
        .merge(function (n) {
            return {
                sum_budget: n('reduction').sum('sum_budget_use')
            }
        })
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            //console.log(req.query)
            // console.log(req.query.group_name)
            res.ireport("welfare2.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare3 = function (req, res) {
    var r = req.r

    // var year = req.query.year;//2017
    // var month = req.query.month;//03
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    r.db('welfare').table('history_welfare')
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true })
        .filter({ 'group_id': param.group_id })
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck("left", { right: 'group_welfare_name' }).zip()
        .eqJoin('emp_id', r.db('welfare').table('employee')).without({ right: 'id' }).zip()
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck("left", { right: 'prefix_name' }).zip()
        .merge(function (name_merge) {
            return {
                name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
            }
        })
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck("left", { right: 'faculty_name' }).zip()
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck("left", { right: 'type_employee_name' }).zip()
        .pluck('faculty_name', 'group_id', 'group_welfare_name', 'name', 'budget_use', 'type_employee_name', 'faculty_id', 'type_employee_id', 'date_approve')
        .group('group_id').ungroup()
        .merge(function (m) {
            return {
                group_welfare_name: m('reduction')('group_welfare_name')(0),
                sum: m('reduction').sum('budget_use')
            }
        })
        .orderBy('group_welfare_name')
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("welfare3.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare4 = function (req, res) {
    var r = req.r

    // var year = req.query.year;//2017
    // var month = req.query.month;//03
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    r.db('welfare').table('history_welfare')
        .filter({ 'personal_id': param.personal_id })
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true, 'group_id': param.group_id })
        .eqJoin('emp_id', r.db('welfare').table('employee')).without({ right: 'id' }).zip()
        .filter({ 'faculty_id': param.faculty_id })
        .filter({ 'type_employee_id': param.type_employee_id })
        // .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck("left", { right: 'prefix_name' }).zip()
        .merge(function (name_merge) {
            return {
                name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
            }
        })
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck("left", { right: 'faculty_name' }).zip()
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck("left", { right: 'type_employee_name' }).zip()
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck("left", { right: 'group_welfare_name' }).zip()
        .pluck('budget_use', 'group_welfare_name', 'id', 'name', 'date_approve', 'emp_id', 'department_name', 'faculty_name', 'type_employee_name')
        .group('emp_id').ungroup()
        .merge(function (group_merge) {
            return {
                name_employee: group_merge('reduction')('name')(0),
                sum_budget: group_merge('reduction').sum('budget_use'),
                type_employee_name: group_merge('reduction')('type_employee_name')(0),
                faculty_name: group_merge('reduction')('faculty_name')(0),
                department_name: group_merge('reduction')('department_name')(0)
            }
        })
        .run()
        .then(function (result) {
            // res.json(result)
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            // if (result.length > 0) {
            //     param.employee_name = result[0].name;
            // }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            // res.json(param);
            res.ireport("welfare4.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare5 = function (req, res) {
    var r = req.r

    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    r.db('welfare').table('history_welfare')
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true, 'group_id': param.group_id })
        .eqJoin('emp_id', r.db('welfare').table('employee')).pluck({ left: ['budget_use', 'welfare_id'] }, { right: ['faculty_id', 'department_id', 'type_employee_id'] }).zip()
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
        .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck('left', { right: ['round_use', 'budget'] }).zip()
        // .merge(function (m) {
        //     return {
        //         budget: r.branch(m('round_use').eq(false), 0, m('budget'))
        //     }
        // })
        .group('faculty_id').ungroup()
        .merge(function (sum_merge) {
            var budget_use = sum_merge('reduction').sum('budget_use');
            var budget = sum_merge('reduction').sum('budget');
            return {
                budget_use: budget_use,
                budget: budget,
                balance: budget.sub(budget_use)
            }
        })
        .without('reduction')
        .eqJoin('group', r.db('welfare_common').table('faculty')).pluck('left', { right: 'faculty_name' }).zip()
        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("welfare5.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare6 = function (req, res) {
    var r = req.r

    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    r.db('welfare').table('history_welfare')
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true, 'group_id': param.group_id })
        .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck("left", { right: 'budget' }).zip()
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck("left", { right: 'group_welfare_name' }).zip()
        .eqJoin('emp_id', r.db('welfare').table('employee')).without({ right: 'id' }).zip()
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
        .merge(function (name_merge) {
            return {
                name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
            }
        })
        .pluck('name', 'date_use', 'budget_use', 'budget_cover', 'budget_balance')


        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("welfare6.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare7 = function (req, res) {
    var r = req.r
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";
    var smonth = parseInt(req.query.date_start.split("-")[1]);
    // var smonth = new Date(req.query.date_start);
    // var emonth = new Date(req.query.date_end);
    // var diffmonth = monthDiff(emonth, smonth);
    // res.json(diffmonth);
    var year = parseInt(req.query.date_start.split("-")[0]);
    var data = [];
    var countMonth = 1;
    for (var i = smonth; i <= 12; i++) {
        var month = parseInt(i);
        if (month < 10) {
            month = "0" + month;
        }
        data.push({
            date_start: year + "-" + month + "-01T00:00:00+07:00",
            date_end: year + "-" + month + "-" + new Date(year, month, 0).getDate() + "T00:00:00+07:00",
            month_name: arr_month[parseInt(i)]
        });
        countMonth++;
        if (countMonth <= 12 && i == 12) {
            year++;
            i = 0;
        } else if (countMonth == 13) {
            i = 12;
        }
    }
    var param = req.query;
    param.year = Number(param.year) + 543;

    // res.json(data);
    r.expr(data)
        .merge(function (data_merge) {
            return {
                history: r.db('welfare').table('history_welfare').coerceTo('array')
                    .filter({ status: true, 'group_id': param.group_id })
                    .eqJoin('emp_id', r.db('welfare').table('employee')).pluck("left", { right: 'id' }).zip()
                    .filter({
                        'faculty_id': param.faculty_id,
                        'type_employee_id': param.type_employee_id,
                        'department_id': param.department_id
                    })
                    .filter(function (f) {
                        return f('date_approve').date().during(
                            r.ISO8601(data_merge('date_start')),
                            r.ISO8601(data_merge('date_end')),
                            { rightBound: 'closed' }
                        )
                    })
                    .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck('left', { right: ['round_use', 'budget'] }).zip()
                // .merge(function (m) {
                //     return {
                //         budget: r.branch(m('round_use').eq(false), 0, m('budget'))
                //     }
                // })
            }
        })
        .merge(function (sum_merge) {
            var budget = sum_merge('history').sum('budget');
            var budget_use = sum_merge('history').sum('budget_use');
            return {
                budget: budget,
                budget_use: budget_use,
                balance: budget.sub(budget_use)
            }
        })
        .without('date_start', 'date_end', 'history')

        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE

            res.ireport("welfare7.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare8 = function (req, res) {
    var r = req.r

    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    // r.db('welfare').table('history_welfare')
    //     .filter({ 'personal_id': param.personal_id })
    //     .filter(function (f) {
    //         return f('date_approve').date().during(
    //             r.ISO8601(date_start),
    //             r.ISO8601(date_end),
    //             { rightBound: "closed" }
    //         )
    //     })
    //     .filter({ status: true, 'group_id': param.group_id })
    //     .eqJoin('emp_id', r.db('welfare').table('employee')).without({ right: 'id' }).zip()
    //     .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck("left", { right: 'welfare_name' }).zip()
    //     .filter({
    //         'faculty_id': param.faculty_id,
    //         'type_employee_id': param.type_employee_id,
    //         'department_id': param.department_id
    //     })
    //     .merge(function (name_merge) {
    //         return {
    //             name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
    //         }
    //     })
    //     .pluck('date_use', 'welfare_name', 'budget_use', 'name')
    r.db('welfare').table('history_welfare')
        .filter({ 'personal_id': param.personal_id })
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ status: true, 'group_id': param.group_id })
        .group('emp_id').ungroup()
        .eqJoin('group', r.db('welfare').table('employee'))
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
        .pluck("left", { right: ['department_name', 'type_employee_name', 'prefix_name', 'firstname', 'lastname', 'faculty_name'] }).zip()
        .merge(function (name_merge) {
            return {
                name_employee: name_merge('prefix_name').add(name_merge('firstname'))
                    .add('  ', name_merge('lastname'))
            }
        })
        .without('prefix_name', 'firstname', 'lastname')
        .merge(function (m) {
            return {
                reduction: m('reduction')
                    .merge(function (mm) {
                        return r.db('welfare').table('welfare').get(mm('welfare_id'))
                            .merge(function (m) {
                                return {
                                    budget: r.branch(m('round_use').eq(false), 0, m('budget'))

                                }
                            })
                    })
                    .pluck('budget_use', 'date_approve', 'welfare_name', 'budget', 'description_detail')
            }
        })
        .merge(function (budget_merge) {
            return {
                // sum_budget: budget_merge('reduction').sum('budget'),
                sum_budget_use: budget_merge('reduction').sum('budget_use')
            }
        })
        // .merge(function (mul_merge) {
        //     return {
        //         balance: mul_merge('sum_budget').sub(mul_merge('sum_budget_use'))
        //     }
        // })
        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            if (result.length > 0) {
                param.employee_name = result[0].name;
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("welfare8.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.welfare9 = function (req, res) {
    var r = req.r
    req.query.year = parseInt(req.query.year);
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        YEAR: req.query.year + '-01' + '-01'
    };

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
            row(select('field_name')).eq(select('value'))
        )
    };

    r.expr({
        employees: r.db('welfare').table('employee').eqJoin('active_id', r.db('welfare_common').table('active'))
            .without({ right: 'id' }).zip().filter({ active_code: 'WORK' })
            .without('dob', 'emp_no', 'firstname', 'lastname')
            .coerceTo('array'),
        group: []
    })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare').filter({ year: req.query.year })//.getAll(req.params.year, { index: 'year' })
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            start_date: m('start_date').toISO8601().split('T')(0),
                            end_date: m('end_date').toISO8601().split('T')(0),
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (wel_merge) {
                                    return {
                                        condition: wel_merge('condition').without('logic_show', 'value_show')
                                        /*.eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()*/
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
                                                    return checkLogic(con_map, f,r)
                                                })
                                                    .coerceTo('array').pluck('id')
                                            })
                                        )
                                    }
                                })
                                .without('employees')
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee').reduce(function (l, r) {
                                            return l.add(r)
                                        })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        emp_budget: wel_merge('employee')
                                            .group('id').count().ungroup()
                                            .filter(function (emp_filter) {
                                                return r.branch(wel_merge('countCon').eq(0),
                                                    emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                                    emp_filter('reduction').eq(wel_merge('countCon'))
                                                )
                                            }).count()
                                    }
                                }).without('employee')
                                .merge(function (wel_merge) {
                                    return {
                                        value_budget: wel_merge('emp_budget').mul(wel_merge('budget'))
                                    }
                                })
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
                                .filter({ year: req.query.year }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
                                .filter({ year: req.query.year }).pluck('emp_id').distinct().count(),
                            time_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
                                .filter({ year: req.query.year }).count()
                        }
                    })
                    .without('welfare')
                    .coerceTo('array')
            }
        })
        .getField('group')
        .orderBy('group_welfare_name')
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("welfare9.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.employee = function (req, res) {
    req.r.db('welfare').table('employee')
        .without('id')
        .pluck('active_name', 'academic_name', 'birthdate', 'department_name', 'emp_no', 'faculty_name', 'firstname', 'gender_name', 'lastname', 'matier_name',
        'personal_id', 'position_name', 'prefix_name', 'start_work_date', 'type_employee_name')
        .group('faculty_name').ungroup()
        .merge(function (m) {
            return {
                reduction: m('reduction').map(function (ma) {
                    return {
                        NEXTCORP01รหัสพนักงาน: ma('emp_no'),
                        NEXTCORP02รหัสบัตรประชาชน: ma('personal_id'),
                        NEXTCORP03ตำแหน่งทางวิชาการ: ma('academic_name'),
                        NEXTCORP04คำนำหน้า: ma('prefix_name'),
                        NEXTCORP05ชื่อ: ma('firstname'),
                        NEXTCORP06นามสกุล: ma('lastname'),
                        NEXTCORP07เพศ: ma('gender_name'),
                        NEXTCORP08วันเกิด: ma('birthdate'),
                        NEXTCORP09วันที่เริ่มงาน: ma('start_work_date'),
                        NEXTCORP10ภาควิชา: ma('department_name'),
                        NEXTCORP11สายงาน: ma('matier_name'),
                        NEXTCORP12ตำแหน่งงาน: ma('position_name'),
                        NEXTCORP13ประเภทพนักงาน: ma('type_employee_name'),
                        NEXTCORP14สถานะการทำงาน: ma('active_name')
                    }
                })
            }
        })
        .run().then(function (data) {
            // res.json(data);
            const XLSX = require('xlsx');
            /* create workbook & set props*/
            const wb = { SheetNames: [], Sheets: {} };
            // // wb.Props = {
            // //     Title: "Stats from app",
            // //     Author: "John Doe"
            // // };
            // /*create sheet data & add to workbook*/
            for (var prop in data) {
                var ws = XLSX.utils.json_to_sheet(data[prop]['reduction']);
                var ws_name = data[prop]['group'].substr(0, 30);
                XLSX.utils.book_append_sheet(wb, ws, ws_name);
            }
            // /* create file 'in memory' */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            var filename = "employee.xlsx";
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            res.type('application/octet-stream');
            res.send(wbout);
        })
}
exports.emp_welfare = function (req, res) {
    var param = req.query;
    param.year = Number(param.year);

    var me = r.db('welfare').table('employee').getAll(param.id, { index: 'id' }).coerceTo('array')
    me
        .merge(function (wel_merge) {
            return {
                employee_name: wel_merge('prefix_name').add(wel_merge('firstname')).add('  ', wel_merge('lastname')),
                group: r.db('welfare').table('welfare').getAll(param.year, 9999, { index: 'year' }).coerceTo('array')
                    .merge(function (m) {
                        return {
                            pass: getEmployee(me, m('condition'),r).ne([])
                        }
                    })
                    .filter({ pass: true })
                    .pluck('welfare_name', 'group_id')
                    .group('group_id').ungroup()
                    .eqJoin('group', r.db('welfare').table('group_welfare'))
                    .pluck("left", { right: ['group_welfare_name', 'status_approve'] }).zip()
                    .filter({ status_approve: true })
                    .without('group')
            }
        })
        .pluck('employee_name', 'type_employee_name', 'faculty_name', 'department_name', 'group')

        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("emp_welfare.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.retire = function (req, res) {

    var param = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SELECT_DATE: req.query.date
    };
    var r = req.r;
    var time = r.ISO8601(req.query.date + 'T00:00:00+07:00');

    var calculateAge = function (birthday) { // birthday is a date
        // var ageDifMs = r.now().toEpochTime().sub(birthday.toEpochTime())
        var ageDifMs = time.toEpochTime().sub(birthday.toEpochTime())
        var ageDate = r.epochTime(ageDifMs); // miliseconds from epoch
        //  return Math.abs(ageDate.year() - 1970);
        return ageDate.year().sub(1970)
    }
    console.log(req.query.date)
    r.db('welfare').table('employee').getAll(time.date(), { index: 'end_work_date' })//.getAll('ทำงาน', { index: 'active_name' })
        .merge(function (use) {
            return {
                birthdate_cal: calculateAge(use('birthdate')),
                age: calculateAge(use('birthdate')),
                work_age: calculateAge(use('start_work_date')),
                start_work_date_cal: calculateAge(use('start_work_date')),
                birthdate: use('birthdate').toISO8601().split('T')(0),
                start_work_date: use('start_work_date').toISO8601().split('T')(0),
                employee_name: use('prefix_name').add(use('firstname')).add('  ', use('lastname'))
            }
        })
        // .filter(function (f) {
        //     return f('birthdate_cal').gt(60)
        // })


        .run()
        .then(function (result) {
            // res.json(result);
            res.ireport("retire.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })

}
exports.welfare10 = function (req, res) {
    var r = req.r

    // var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    // var date_end = req.query.date_end + "T00:00:00+07:00";

    var param = req.query;
    param.year = Number(param.year) + 543;

    var emp = r.db('welfare').table('employee').coerceTo('array')//.filter({ faculty_id: 'd9bf815e-44f5-49a2-9721-dc2ee188c8da' })
        .filter({
            'faculty_id': param.faculty_id,
            'type_employee_id': param.type_employee_id,
            'department_id': param.department_id
        })
    var his = r.db('welfare').table('history_welfare').coerceTo('array')//.filter({ group_id: '96cb5c8e-0f3f-442d-87f7-4d1b18e95ecd' }).filter({ status: true })
        .filter({ status: true, type_group: 'general', 'group_id': param.group_id })
    r.db('welfare').table('welfare')//.filter({ group_id: '96cb5c8e-0f3f-442d-87f7-4d1b18e95ecd' })
        .filter({ 'group_id': param.group_id })

        .concatMap(function (emp_con) {
            var conditions = emp_con('condition');
            return getEmployee(emp, conditions,r)
                .merge(function (m) {
                    var data_his = his.filter({ emp_id: m('id') });
                    return r.branch(
                        data_his.eq([]),
                        { budget_emp: 0, budget_use: 0, date_use: '', date_approve: '' },
                        data_his.pluck('budget_emp', 'budget_use', 'date_use', 'date_approve')(0)
                    )
                })
        })
        .merge(function (name_merge) {
            return {
                name_employee: name_merge('prefix_name').add(name_merge('firstname'))
                    .add('  ', name_merge('lastname'))
            }
        })


        // .map(function (emp_con) {
        //     var conditions = emp_con('condition');
        //     return getEmployee(emp, conditions)
        //         .merge(function (m) {
        //             var data_his = his.filter({ emp_id: m('id') });
        //             return r.branch(
        //                 data_his.eq([]),
        //                 { budget_emp: 0, budget_use: 0 },
        //                 data_his.pluck('budget_emp', 'budget_use')(0)
        //             )
        //         })
        // })
        // .reduce(function (left, right) {
        //     return left.union(right)
        // })
        // .merge(function (name_merge) {
        //     return {
        //         name_employee: name_merge('prefix_name').add(name_merge('firstname'))
        //             .add('  ', name_merge('lastname'))
        //     }
        // })
        // .pluck('name_employee')
        .run()
        .then(function (result) {
            // res.json(result);
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            if (result.length > 0) {
                param.employee_name = result[0].name;
            }
            param = keysToUpper(param);
            CURRENT_DATE = new Date().toISOString().slice(0, 10)
            param.CURRENT_DATE = CURRENT_DATE
            res.ireport("welfare10.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}
exports.group_health = function (req, res) {
    var r = req.r

    // // var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    // // var date_end = req.query.date_end + "T00:00:00+07:00";

    // var param = req.query;
    // param.year = Number(param.year) + 543;
    var time = r.now().inTimezone('+07')
    var calculateAge = function (birthday) { // birthday is a date
        // var ageDifMs = r.now().toEpochTime().sub(birthday.toEpochTime())
        var ageDifMs = time.toEpochTime().sub(birthday.toEpochTime())
        var ageDate = r.epochTime(ageDifMs); // miliseconds from epoch
        //  return Math.abs(ageDate.year() - 1970);
        return ageDate.year().sub(1970)
    }

    // var emp = r.db('welfare').table('employee').coerceTo('array')//.filter({ faculty_id: 'd9bf815e-44f5-49a2-9721-dc2ee188c8da' })
    //     .filter({
    //         'faculty_id': param.faculty_id,
    //         'type_employee_id': param.type_employee_id,
    //         'department_id': param.department_id
    //     })
    // var his = r.db('welfare').table('history_welfare').coerceTo('array')//.filter({ group_id: '96cb5c8e-0f3f-442d-87f7-4d1b18e95ecd' }).filter({ status: true })
    //     .filter({ status: true, 'group_id': param.group_id })
    // r.db('welfare').table('welfare')//.filter({ group_id: '96cb5c8e-0f3f-442d-87f7-4d1b18e95ecd' })
    //     .filter({ 'group_id': param.group_id })

    //     .concatMap(function (emp_con) {
    //         var conditions = emp_con('condition');
    //         return getEmployee(emp, conditions)
    //     })
    //     .merge(function (name_merge) {
    //         return {
    //             name_employee: name_merge('prefix_name').add(name_merge('firstname'))
    //                 .add('  ', name_merge('lastname')),
    //             age: calculateAge(name_merge('birthdate'))
    //         }
    //     }).orderBy('faculty_name')
    //     .run()
    //     .then(function (result) {
    //         // res.json(result);
    //         if (req.query.res_type == 'json') {
    //             res.json(result);
    //         }
    //         if (result.length > 0) {
    //             param.employee_name = result[0].name;
    //         }
    //         param = keysToUpper(param);
    //         CURRENT_DATE = new Date().toISOString().slice(0, 10)
    //         param.CURRENT_DATE = CURRENT_DATE
    //         res.ireport("group_health.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
    //     });

    var emp = r.db('welfare').table('employee').coerceTo('array')//.filter({ faculty_id: 'd9bf815e-44f5-49a2-9721-dc2ee188c8da' })
        .filter({
            'faculty_id': req.query.faculty_id,
            'type_employee_id': req.query.type_employee_id,
            'department_id': req.query.department_id
        })
    var his = r.db('welfare').table('history_welfare').coerceTo('array')//.filter({ group_id: '96cb5c8e-0f3f-442d-87f7-4d1b18e95ecd' }).filter({ status: true })
        .filter({ status: true, type_group: 'general', 'group_id': req.query.group_id })
    r.db('welfare').table('welfare')//.filter({ group_id: '96cb5c8e-0f3f-442d-87f7-4d1b18e95ecd' })
        .filter({ 'group_id': req.query.group_id })

        .concatMap(function (emp_con) {
            var conditions = emp_con('condition');
            return getEmployee(emp, conditions,r)
        })
        .merge(function (name_merge) {
            return {
                name_employee: name_merge('prefix_name').add(name_merge('firstname'))
                    .add('  ', name_merge('lastname')),
                age: calculateAge(name_merge('birthdate'))
            }
        })
        .pluck('birthdate', 'department_name', 'faculty_name', 'gender_name', 'personal_id', 'name_employee','age')
        .group('faculty_name').ungroup()
        .merge(function (m) {
            return {
                reduction: m('reduction').map(function (ma) {
                    return {
                        NEXTCORP01รหัสบัตรประชาชน: ma('personal_id'),
                        NEXTCORP02ชื่อ: ma('name_employee'),
                        NEXTCORP03อายุ: ma('age'),
                        NEXTCORP04เพศ: ma('gender_name'),
                        NEXTCORP05วันเกิด: ma('birthdate'),
                        NEXTCORP06คณะ: ma('faculty_name'),
                        NEXTCORP07ภาควิชา: ma('department_name')
                    }
                })
            }
        })
        .run().then(function (data) {
            // res.json(data);
            const XLSX = require('xlsx');
            /* create workbook & set props*/
            const wb = { SheetNames: [], Sheets: {} };
            // // wb.Props = {
            // //     Title: "Stats from app",
            // //     Author: "John Doe"
            // // };
            // /*create sheet data & add to workbook*/
            for (var prop in data) {
                var ws = XLSX.utils.json_to_sheet(data[prop]['reduction']);
                var ws_name = data[prop]['group'].substr(0, 30);
                XLSX.utils.book_append_sheet(wb, ws, ws_name);
            }
            // /* create file 'in memory' */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            var filename = "group_health.xlsx";
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            res.type('application/octet-stream');
            res.send(wbout);
        })
}

function keysToUpper(param) {
    var keyname = Object.keys(param);
    for (var i = 0; i < keyname.length; i++) {
        param[keyname[i].toUpperCase()] = param[keyname[i]];
        delete param[keyname[i]];
    }
    return param;
}