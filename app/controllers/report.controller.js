var checkLogic = function (select, row, r) {
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
var getEmployee = function (emp, con, r) {
    var countCon = con.count();
    return r.branch(countCon.gt(1),
        con.reduce(function (left, right) {
            return r.branch(left.hasFields('data'),
                {
                    data: left('data').filter(function (f) {
                        return checkLogic(right, f, r)
                    })
                },
                {
                    data: emp.filter(function (f) {
                        return checkLogic(left, f, r)
                    }).filter(function (f) {
                        return checkLogic(right, f, r)
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
exports.report11 = function (req, res, next) {
    var r = req.r
    /*var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\'
    };
    // var emps = r.db('welfare').table('employee').without('dob');
    r.expr({
        employees: r.db('welfare').table('employee').without('dob').coerceTo('array'),
        welfare: []
    })
        .merge(function (root_merge) {
            return {
                welfare: r.db('welfare').table('welfare').getAll(req.params.id, { index: 'id' }).coerceTo('array')
                    .merge(function (wel_merge) {
                        return {
                            condition: wel_merge('condition').without('logic_show', 'value_show')
                                .eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()
                        }
                    })
                    .merge(function (wel_merge) {
                        return {
                            countCon: wel_merge('condition').count(),
                            employee: r.branch(wel_merge('condition').count().eq(0),
                                [root_merge('employees')],
                                wel_merge('condition').map(function (con_map) {
                                    return root_merge('employees').filter(function (f) {
                                        return f(con_map('field')).do(function (d) {
                                            return r.branch(con_map('logic').eq(">="),
                                                d.ge(con_map('value')),
                                                r.branch(con_map('logic').eq(">"),
                                                    d.gt(con_map('value')),
                                                    r.branch(con_map('logic').eq("<="),
                                                        d.le(con_map('value')),
                                                        r.branch(con_map('logic').eq("<"),
                                                            d.lt(con_map('value')),
                                                            r.branch(con_map('logic').eq("=").or(con_map('logic').eq("==")),
                                                                d.eq(con_map('value')),
                                                                d.ne(con_map('value'))
                                                            )
                                                        )
                                                    )
                                                )
                                            )
                                        })
                                    }).coerceTo('array').pluck('id')
                                })
                            )
                        }
                    }).without('condition')
                    .merge(function (wel_merge) {
                        return {
                            employee: wel_merge('employee').reduce(function (l, r) {
                                return l.add(r)
                            })
                                .group('id').count().ungroup()
                                .filter(function (emp_filter) {
                                    return r.branch(wel_merge('countCon').eq(0),
                                        emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                        emp_filter('reduction').eq(wel_merge('countCon'))
                                    )
                                })
                        }
                    })
                    .merge(function (count_merge) {
                        return {
                            count_employee: count_merge('employee').count(),
                            employee: count_merge('employee')
                                .eqJoin('group', r.db('welfare').table('employee')).without({ left: ['group', 'reduction'] }).zip()
                                .eqJoin('active_id', r.db('welfare_common').table('active')).without({ right: 'id' }).zip()
                                .eqJoin('department_id', r.db('welfare_common').table('department')).without({ right: 'id' }).zip()
                                .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).without({ right: 'id' }).zip()
                                .eqJoin('gender_id', r.db('welfare_common').table('gender')).without({ right: 'id' }).zip()
                                .eqJoin('matier_id', r.db('welfare_common').table('matier')).without({ right: 'id' }).zip()
                                .eqJoin('position_id', r.db('welfare_common').table('position')).without({ right: 'id' }).zip()
                                .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).without({ right: 'id' }).zip()
                                .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).without({ right: 'id' }).zip()
                                .without('dob', 'academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'prefixname_id', 'type_employee_id')
                                .merge(function (mm) {
                                    return {
                                        name: mm('prefix_name').add(mm('firstname'), mm('lastname')),
                                        department_fuculty_name: mm('department_name').add(' ', mm('faculty_name'))
                                    }
                                })
                                .without('prefix_name', 'firstname', 'lastname'),
                        }
                    })
                    .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck('left', { right: 'group_welfare_name' }).zip()
            }
        })
        // .without('employees')
        .getField('welfare')
        .run()
        .then(function (result) {
            res.json(result);

            // res.ireport("report1.jasper", req.query.EXPORT  || req.query.export || "pdf", result);
        }); */
    var query = r.db('welfare').table('employee');
    //.pluck('position_id','department_id','gender_id');

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

    query.filter(function (row) {
        return checkLogic(r.expr({ field: "gender_id", logic: '=', value: "c16d1fba-6d2d-4300-8dc6-2b1582e230cd" }), row,r)
    })
        .eqJoin('active_id', r.db('welfare_common').table('active')).without({ right: 'id' }).zip()
        .eqJoin('department_id', r.db('welfare_common').table('department')).without({ right: 'id' }).zip()
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).without({ right: 'id' }).zip()
        .eqJoin('gender_id', r.db('welfare_common').table('gender')).without({ right: 'id' }).zip()
        .eqJoin('matier_id', r.db('welfare_common').table('matier')).without({ right: 'id' }).zip()
        .eqJoin('position_id', r.db('welfare_common').table('position')).without({ right: 'id' }).zip()
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).without({ right: 'id' }).zip()
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).without({ right: 'id' }).zip()
        .without('dob', 'academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'prefixname_id', 'type_employee_id')
        .merge(function (mm) {
            return {
                name: mm('prefix_name').add(mm('firstname'), mm('lastname')),
                department_fuculty_name: mm('department_name').add(' ', mm('faculty_name'))
            }
        })
        .without('prefix_name', 'firstname', 'lastname')
        .run()
        .then(function (result) {
            res.json(result);

            // res.ireport("report1.jasper", req.query.EXPORT  || req.query.export || "pdf", result);
        });

}
exports.report2 = function (req, res) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        date_start: req.query.date_start
    };

    var date_start = req.query.date_start + "T00:00:00+07:00";
    var date_end = req.query.date_end + "T00:00:00+07:00";
    var res_type = req.query.res_type;
    // console.log(date_start);

    r.db('welfare').table('history_welfare').filter(function (row) {
        return row('date_approve').date().eq(r.ISO8601(date_start))
        // .eq(req.query.date_start)
    }).filter({ status: true })
        .merge(function (emp_merge) {
            return r.db('welfare').table('employee').get(emp_merge('emp_id')).pluck('prefix_id', 'emp_no', 'firstname', 'lastname')
        })
        .merge(function (prefix_merge) {
            return r.db('welfare_common').table('prefix').get(prefix_merge('prefix_id')).pluck('prefix_name')
        })
        .merge(function (name_merge) {
            return {
                name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
            }
        })
        .without('prefix_name', 'firstname', 'lastname')
        .merge(function (group_merge) {
            return r.db('welfare').table('group_welfare').get(group_merge('group_id')).pluck('group_welfare_name')
        })
        .merge(function (wel_merge) {
            return r.db('welfare').table('welfare').get(wel_merge('welfare_id')).pluck('welfare_name')
        })
        .merge(function (name_merge) {
            return {
                group_welfare_name: name_merge('group_welfare_name').add(' (', name_merge('welfare_name'), ')')
            }
        })
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }

            //   if (result.length > 0 ) 
            res.ireport("report2.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.report2_1 = function (req, res) {
    var params = req.query;
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        date_start: params.date_start
        // group_welfare_name:params.group_welfare_name
    };

    r.db('welfare').table('group_welfare').get(params.group_id)
        .pluck('group_welfare_name')
        .merge(function (m) {
            return {
                history_welfare: r.db('welfare').table('history_welfare').coerceTo('array')
                    .filter(function (row) {
                        return row("group_id").eq(params.group_id).and(
                            row("date_approve").date().eq(r.ISO8601(params.date_start + "T00:00:00+07:00"))
                        )
                        // .eq(params.date_start)
                    })
                    .filter({ status: true })
                    .merge(function (emp_merge) {
                        return r.db('welfare').table('employee').get(emp_merge('emp_id')).pluck('prefix_id', 'emp_no', 'firstname', 'lastname')
                    })
                    .merge(function (prefix_merge) {
                        return r.db('welfare_common').table('prefix').get(prefix_merge('prefix_id')).pluck('prefix_name')
                    })
                    .merge(function (name_merge) {
                        return {
                            name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname')),
                            group_welfare_name: m('group_welfare_name'),
                            date_approve: name_merge('date_approve').toISO8601()
                        }
                    })
                    .without('prefix_name', 'firstname', 'lastname', 'document_ids')
                    .merge(function (wel_merge) {
                        return r.db('welfare').table('welfare').get(wel_merge('welfare_id')).pluck('welfare_name')
                    })
            }
        })
        // .merge(function(m){
        //     return m('history_welfare')
        // })

        .run()
        .then(function (result) {
            parameters.group_welfare_name = result.group_welfare_name;
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("report2_1.jasper", req.query.EXPORT || req.query.export || "pdf", result.history_welfare, parameters);
        });
}
exports.report3 = function (req, res, next) {
    var r = req.r
    req.query.year = parseInt(req.query.year);
    // var year = req.query.year;//2017
    // var month = req.query.month;//03
    var year = parseInt(req.query.year);//2017
    var month = parseInt(req.query.month);//03
    // console.log(year)
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        month: parseInt(year) + '-' + month + '-01',
        year: parseInt(year) + 543
    };
    // console.log(req.query.year)

    r.expr({
        employees: r.db('welfare').table('employee').filter({ active_id: 'WORK' }).coerceTo('array'),
        history_welfare: r.db('welfare').table('history_welfare')
            .filter(function (his_filter) {
                return his_filter('date_use').year().eq(year)
                    .and(
                    his_filter('date_use').month().eq(month)
                    )
                // .and(
                // his_filter('status').eq('approve')
                // )
            })
            // .merge(function (mmmm) {
            //     return {
            //         aa: mmmm('date_use').year(),
            //         bb: mmmm('date_use').month(),
            //         cc: mmmm('date_use').year().eq(year),
            //         dd: mmmm('date_use').month().eq(month),
            //         ee: year,
            //         ff: month
            //     }
            // })
            .coerceTo('array')
            .pluck('group_id', 'id', 'budget_use', 'emp_id'),
        group: []
    })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare')
                    .getAll(req.query.year, { index: 'year' })
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (wel_merge) {
                                    return {
                                        condition: wel_merge('condition')
                                        // .eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()
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
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee').reduce(function (l, r) {
                                            return l.add(r)
                                        })
                                            .group('id').count().ungroup()
                                            .filter(function (emp_filter) {
                                                return r.branch(wel_merge('countCon').eq(0),
                                                    emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                                    emp_filter('reduction').eq(wel_merge('countCon'))
                                                )
                                            })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        value_budget: wel_merge('employee').count().mul(wel_merge('budget')),
                                        emp_budget: wel_merge('employee').count()
                                    }
                                })

                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use: group_merge('history_welfare').filter(function (f) {
                                return f('group_id').eq(m('id'))
                            }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: group_merge('history_welfare').filter(function (f) {
                                return f('group_id').eq(m('id'))
                            }).pluck('emp_id').distinct().count(),
                            time_use: group_merge('history_welfare').filter(function (f) {
                                return f('group_id').eq(m('id'))
                            }).count()
                        }
                    })
                    .without('welfare', 'history_welfare')
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
            res.ireport("report3.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.report3_1 = function (req, res) {
    var r = req.r
    req.query.year = parseInt(req.query.year);
    var year = req.query.year;//2017
    var month = req.query.month;//03

    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        month: parseInt(year) + '-' + month + '-01',
        year: parseInt(year) + 543
    };
    // var r = req.r
    // req.query.year = parseInt(req.query.year);
    // var year = req.query.year;//2017
    // var month = req.query.month;//03
    // var date_start = year + "-" + month + "-01";
    // // var date_end_arr = req.query.date_end.split('-');
    // var nextMonth = (parseInt(month) + 1);
    // if (nextMonth < 10) {
    //     nextMonth = "0" + nextMonth;
    //     if (nextMonth == 13) {
    //         nextMonth = "01";
    //     }
    // }
    // var date_end = (nextMonth == "01" ? parseInt(year) + 1 : year) + "-" + nextMonth + "-01"; //2017-12-01 2018-01-01
    // var parameters = {
    //     CURRENT_DATE: new Date().toISOString().slice(0, 10),
    //     SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
    //     month: date_start,
    //     year: date_start
    // };
    // console.log(year);

    r.expr({
        employees: r.db('welfare').table('employee').filter({ active_id: 'WORK' }).coerceTo('array'),
        history_welfare: r.db('welfare').table('history_welfare').filter({ status: 'true' })
            .filter(function (his_filter) {
                return his_filter('date_use').year().eq(year)
                    .and(
                    his_filter('date_use').month().eq(month)
                    )
                    .and(
                    his_filter('status').eq('approve')
                    )
            }).coerceTo('array').pluck('group_id', 'id', 'use_budget', 'emp_id'),
        group: []
    })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare').get(req.query.group_id)
                    .pluck('id', 'group_welfare_name', 'year')
                    .merge(function (m) {
                        return {
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (wel_merge) {
                                    return {
                                        condition: wel_merge('condition')
                                            .eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()
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
                                                    .coerceTo('array')
                                            })
                                        )
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee').reduce(function (l, r) {
                                            return l.add(r)
                                        })
                                            .group('id').count().ungroup()
                                            .filter(function (emp_filter) {
                                                return r.branch(wel_merge('countCon').eq(0),
                                                    emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                                    emp_filter('reduction').eq(wel_merge('countCon'))
                                                )
                                            })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        value_budget: wel_merge('employee').count().mul(wel_merge('budget')),
                                        emp_budget: wel_merge('employee').count()
                                    }
                                })
                        }
                    })

                    .merge(function (m) {
                        return {
                            welfare_name: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .pluck('welfare_name', 'id')
                                .merge(function (change_name) {
                                    return {
                                        welfare_id: change_name('id')
                                    }
                                }).without('id')
                                .merge(function (mm) {
                                    return {
                                        value_use: group_merge('history_welfare').filter({ welfare_id: mm('welfare_id') }).sum('use_budget'),
                                        emp_budget: m('welfare').filter({ id: mm('welfare_id') }).sum('emp_budget'),
                                        emp_use: group_merge('history_welfare').filter({ welfare_id: mm('welfare_id') }).pluck('emp_id').distinct().count(),
                                        time_use: group_merge('history_welfare').filter({ welfare_id: mm('welfare_id') }).count()
                                    }
                                })
                        }
                    })
                    .without('welfare', 'history_welfare')
            }
        })
        .getField('group')
        .run()
        .then(function (result) {
            parameters.group_welfare_name = result.group_welfare_name;
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("report3_1.jasper", req.query.EXPORT || req.query.export || "pdf", result.welfare_name, parameters);
        })
}
exports.report4 = function (req, res, next) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        YEAR: req.params.year + "-01-01"
    };
    var date_start = "2017-01-01";
    var date_end = "2017-12-31";

    /* r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' })
       
         .merge(function (emp_merge) {
             return r.db('welfare').table('employee').get(emp_merge('emp_id')).pluck('prefix_id', 'emp_no', 'firstname', 'lastname')
         })
         .merge(function (prefix_merge) {
             return r.db('welfare_common').table('prefix').get(prefix_merge('prefix_id')).pluck('prefix_name')
         })
         .merge(function (name_merge) {
             return {
                  name : name_merge('prefix_name').add( name_merge('firstname')).add('  ', name_merge('lastname'))
                 }
             })
             .without('prefix_name','firstname','lastname')
         .merge(function (group_merge) {
             return r.db('welfare').table('group_welfare').get(group_merge('group_id')).pluck('group_welfare_name')
         })
       .merge(function (date_merge) {
             return {
                 date_use: date_merge('date_use').split('T')(0),
             }
         })
        .group('group_id')
       .ungroup()
      .merge(function (group_merge) {
         return {
           group_welfare_name : group_merge('reduction').getField('group_welfare_name')(0),
           year : group_merge('reduction').getField('year')(0)
         }
       })
     .orderBy('year')
        .merge(function (group_merge) {
         return {
           count_use : group_merge('reduction').count(),
           sum_use_budget:group_merge('reduction').sum('use_budget'),
           count_emp : group_merge('reduction')
           .group('emp_id')
           .ungroup()
           .count()
         }
       }) .group('emp_id')
           .ungroup()
        .merge(function (sum_emp_merge){
         return {
           sum_emp :sum_emp_merge('reduction').sum('count_emp'),
           sum_use :sum_emp_merge('reduction').sum('count_use'),
           sum_budget :sum_emp_merge('reduction').sum('sum_use_budget')
         }
       }).without('group')
       .merge(function (m) {
           return { 
     aa : m('reduction').getField('reduction')(0)
     }
     })
      .merge(function (m) {
     return { 
     date_use :m('aa').getField('date_use')(0)
     }
     })
       .without('aa') */
    var year = req.params.year;
    var arr_month = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    var data = [];
    for (var i = 1; i <= 12; i++) {
        var month = 0;
        var nextMonth = 0;
        if (i < 10) {
            month = "0" + i;
            nextMonth = i + 1;
        } else {
            month = i;
            if (i == 12) {
                nextMonth = 1;
            } else {
                nextMonth = i;
            }
        }
        if (nextMonth < 10) {
            nextMonth = "0" + nextMonth;
        }
        data.push({
            date_start: year + "-" + month + "-01",
            date_end: year + "-" + nextMonth + "-01",
            month_name: arr_month[i]
        });
    }
    r.expr(data)
        .merge(function (data_merge) {
            return {
                sum_use: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).filter({ status: 'approve' }).count(),
                sum_emp: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).filter({ status: 'approve' }).group('emp_id').ungroup().count(),
                sum_budget: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).filter({ status: 'approve' }).sum('use_budget')
            }
        })
        .without('date_start', 'date_end')
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("report4.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.report4_1 = function (req, res, next) {
    var params = req.query;
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        YEAR: params.year + "-01-01"
    };
    var date_start = "2017-01-01";
    var date_end = "2018-01-01";

    // var group_id = req.params.group_id;
    var year = params.year;
    var arr_month = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    var data = [];
    for (var i = 1; i <= 12; i++) {
        var month = 0;
        var nextMonth = 0;
        if (i < 10) {
            month = "0" + i;
            nextMonth = i + 1;
        } else {
            month = i;
            nextMonth = i + 1;
            if (i == 12) {
                nextMonth = 1;
            }
        }
        if (nextMonth < 10) {
            nextMonth = "0" + nextMonth;
        }
        data.push({
            date_start: year + "-" + month + "-01",
            date_end: (nextMonth == "01" ? parseInt(year) + 1 : year) + "-" + nextMonth + "-01",
            month_name: arr_month[i]
        });
    }

    r.expr({
        // group_welfare: r.db('welfare').table('history_welfare').getAll(params.group_id, { index: 'group_id' }).filter({status:'approve'}).coerceTo('array'),
        date: data
    })
        //     .merge((root_merge) => {
        //         return {
        //             date: root_merge('date').merge((date_merge) => {
        //                 return {
        //                     // data_start:date_merge('date_start')
        //                     data: root_merge('group_welfare').filter(function (data_filter) {
        //                         return data_filter('date_use').ge(date_merge('date_start')).and(data_filter('date_use').lt(date_merge('date_end')))
        //                     })
        //                 }
        //             })
        //         }
        //     })
        //     .getField('date')

        // r.expr({
        //     group_welfare: r.db('welfare').table('history_welfare')//.getAll(params.group_id, { index: 'group_id' }).filter({status:'approve'}).coerceTo('array')
        //   date: data 
        //  r.db('welfare').table('group_welfare')
        // .merge(function (m) {
        //     return  r.db('welfare').table('history_welfare').coerceTo('array')
        // })
        // })



        .run()
        .then(function (result) {
            // res.json(result);
            // parameters.group_welfare_name = result.group_welfare_name;
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("report4_1.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.report4_2 = function (req, res, next) {
    var params = req.query;
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        YEAR: req.params.year + "-01-01"
    };
    var date_start = "2017-01-01";
    var date_end = "2017-12-31";

    // var group_id = req.params.group_id;
    var year = req.params.year;
    var arr_month = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    var data = [];
    for (var i = 1; i <= 12; i++) {
        var month = 0;
        var nextMonth = 0;
        if (i < 10) {
            month = "0" + i;
            nextMonth = i + 1;
        } else {
            month = i;
            if (i == 12) {
                nextMonth = 1;
            } else {
                nextMonth = i;
            }
        }
        if (nextMonth < 10) {
            nextMonth = "0" + nextMonth;
        }
        data.push({
            date_start: year + "-" + month + "-01",
            date_end: year + "-" + nextMonth + "-01",
            month_name: arr_month[i]
        });
    }

    r.expr(data)
        .merge(function (data_merge) {
            return {
                history_welfare: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' })
                    .filter({ status: 'approve' })
                    // .coerceTo('array')

                    //        .merge(function (da_merge) {
                    //     return {
                    //         sum_use: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).count(),
                    //         sum_emp: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).group('emp_id').ungroup().count(),
                    //         sum_budget: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).sum('use_budget')
                    //     }
                    // })
                    .merge(function (wel_merge) {
                        return r.db('welfare').table('group_welfare').get(wel_merge('group_id')).pluck('group_welfare_name')
                    })
                    .group('group_id').ungroup()

                    .merge(function (group_merge) {
                        return {
                            count_use: group_merge('reduction').count(),
                            sum_use_budget: group_merge('reduction').sum('use_budget'),
                            count_emp: group_merge('reduction')
                                .group('emp_id')
                                .ungroup()
                                .count()

                        }
                    })
                    .merge(function (re_merge) {
                        return {
                            reduction: re_merge('reduction')
                                .merge(function (m) {
                                    return {
                                        count_emp: re_merge('count_emp'),
                                        count_use: re_merge('count_use'),
                                        sum_use_budget: re_merge('sum_use_budget')
                                    }
                                })
                                .merge(function (emp_merge) {
                                    return r.db('welfare').table('employee').get(emp_merge('emp_id')).pluck('prefix_id', 'emp_no', 'firstname', 'lastname')
                                })
                        }
                    })
                    .merge(function (m) {
                        return {
                            reduction1: m('reduction')(0)
                        }
                    })
                    .without('reduction')
                    .merge(function (mm) {
                        return mm('reduction1')
                    })
                    .without('reduction1')
            }
        })
        .without('date_start', 'date_end')

        .run()
        .then(function (result) {

            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("report4_2.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.report5 = function (req, res) {
    var r = req.r

    var year = req.query.year;//2017
    var month = req.query.month;//03
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    r.db('welfare').table('history_welfare')
        // .between(date_start, date_end, { index: 'date_use' })
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            ).and(f('status').eq(true))
        })
        .merge(function (emp_merge) {
            return r.db('welfare').table('employee').get(emp_merge('emp_id')).pluck('prefix_id', 'emp_no', 'firstname', 'lastname')
        })
        .merge(function (prefix_merge) {
            return r.db('welfare_common').table('prefix').get(prefix_merge('prefix_id')).pluck('prefix_name')
        })
        .merge(function (name_merge) {
            return {
                name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
            }
        })
        .without('prefix_name', 'firstname', 'lastname')
        .merge(function (group_merge) {
            return r.db('welfare').table('group_welfare').get(group_merge('group_id')).pluck('group_welfare_name')
        })
        .merge(function (wel_merge) {
            return r.db('welfare').table('welfare').get(wel_merge('welfare_id')).pluck('welfare_name')
        })
        .merge(function (name_merge) {
            return {
                group_welfare_name: name_merge('group_welfare_name').add(' (', name_merge('welfare_name'), ')')
            }
        })
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            //   if (result.length > 0 ) 
            var parameters = {
                CURRENT_DATE: new Date().toISOString().slice(0, 10),
                // SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
                date_start: date_start,
                date_end: date_end
            };
            res.ireport("report5.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.report5_1 = function (req, res) {
    var params = req.query;
    var r = req.r

    var year = req.query.year;//2017
    var month = req.query.month;//03
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";
    // var date_end = date_end_arr[0] + "-" + date_end_arr[1] + "-" + (parseInt(date_end_arr[2]) + 1); //year+"-"+month+"-31"

    r.db('welfare').table('group_welfare').get(params.group_id).pluck('group_welfare_name', 'id')
        .merge(function (m) {
            return {
                history_welfare: r.db('welfare').table('history_welfare')
                    // .between(date_start, date_end, { index: 'date_use' })
                    .coerceTo('array')
                    .filter(function (f) {
                        return f('date_use').date().during(
                            r.ISO8601(date_start),
                            r.ISO8601(date_end),
                            { rightBound: "closed" }
                        )//.and(f('status').eq('approve'))
                            .and(f('group_id').eq(params.group_id))
                    })
                    .merge(function (emp_merge) {
                        return r.db('welfare').table('employee').get(emp_merge('emp_id')).pluck('prefix_id', 'emp_no', 'firstname', 'lastname')
                    })
                    .merge(function (prefix_merge) {
                        return r.db('welfare_common').table('prefix').get(prefix_merge('prefix_id')).pluck('prefix_name')
                    })
                    .merge(function (name_merge) {
                        return {
                            name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname')),
                            group_welfare_name: m('group_welfare_name')
                        }
                    })
                    .without('prefix_name', 'firstname', 'lastname', 'document_ids')

                    // .merge(function (wel_merge) {
                    //     return r.db('welfare').table('welfare').get(wel_merge('welfare_id')).pluck('welfare_name')
                    // })
                    .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck("left", { right: "welfare_name" }).zip()
            }
        })

        .run()
        .then(function (result) {
            var parameters = {
                CURRENT_DATE: new Date().toISOString().slice(0, 10),
                // SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
                date_start: date_start,
                date_end: date_end
            };
            parameters.group_welfare_name = result.group_welfare_name;
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            //   if (result.length > 0 ) 

            res.ireport("report5_1.jasper", req.query.EXPORT || req.query.export || "pdf", result.history_welfare, parameters);
        });
}
exports.report6 = function (req, res, next) {
    var r = req.r
    req.query.year = parseInt(req.query.year);
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        YEAR: req.query.year + '-01' + '-01'
    };

    r.db('welfare').table('group_welfare').filter({ year: req.query.year })
        .merge(function (wel_merge) {
            return {
                welfare: r.db('welfare').table('welfare').filter({ group_id: wel_merge('id') }).coerceTo('array')
                    .merge(function (m) {
                        return {
                            welfare_id: m('id')
                        }
                    })
                    .merge(function (his_merge) {
                        return {
                            history_welfare: r.db('welfare').table('history_welfare').getAll(his_merge('welfare_id'), { index: 'welfare_id' })//.filter({ status: 'approve' })
                                .merge(function (emp_merge) {
                                    return r.db('welfare').table('employee').get(emp_merge('emp_id')).without('id')
                                })
                                .coerceTo('array')
                        }
                    })
                    .merge(function (m) {
                        return {
                            count_use: m('history_welfare')('emp_id').distinct().count()
                        }
                    })
                    .merge(function (mul_use_merge) {
                        return {
                            count_budget: mul_use_merge('budget').mul(mul_use_merge('count_use'))
                        }
                    })
                    .do(function (result) {
                        return r.branch(result.count().eq(0), [],
                            result.reduce(function (left, right) {
                                return {
                                    budget: left('budget').add(right('budget')),
                                    count_budget: left('count_budget').add(right('count_budget')),
                                    history_welfare: left('history_welfare').union(right('history_welfare'))

                                }
                            })
                                .merge(function (row) {

                                    return row('history_welfare')
                                        .merge(function (m) {
                                            return {
                                                month: m('date_use').month()
                                            }
                                        })
                                        .group('month').sum('budget_use')
                                        .ungroup()
                                        .do(function (result) {
                                            return {
                                                history_welfare: result,
                                                result: r.expr([
                                                    { month: "January", number: 1 },
                                                    { month: "February", number: 2 },
                                                    { month: "March", number: 3 },
                                                    { month: "April", number: 4 },
                                                    { month: "May", number: 5 },
                                                    { month: "June", number: 6 },
                                                    { month: "July", number: 7 },
                                                    { month: "August", number: 8 },
                                                    { month: "September", number: 9 },
                                                    { month: "October", number: 10 },
                                                    { month: "November", number: 11 },
                                                    { month: "December", number: 12 }
                                                ])
                                                    .merge(function (row) {
                                                        return result.filter({ group: row('number') })
                                                            .do(
                                                            function (result) {
                                                                return {
                                                                    use_budget: r.branch(result.count().eq(0), 0, result(0)('reduction'))
                                                                }
                                                            }
                                                            )
                                                    })
                                            }
                                        })
                                        .merge(function (row) {
                                            return {
                                                result: r.object(r.args(row('result').concatMap(function (row) {
                                                    return [row('month'), row('use_budget')]
                                                })))
                                                ,
                                                use_budget: row('result').sum('use_budget')
                                            }
                                        })
                                })
                        )
                    })
            }
        })
        .merge(function (row) {
            return r.branch(row('welfare').typeOf().eq('OBJECT'),
                row('welfare').merge(function (row) {
                    return row('result')
                })
                , { welfare: [] })
        })
        .without('onetime', 'result', 'history_welfare', 'welfare', 'status', 'status_approve', 'group_use', 'condition', 'description', 'end_date')
        .merge(function (m) {
            return {
                sum_month: m('January').add(m('February')).add(m('March')).add(m('April')).add(m('May')).add(m('June')).add(m('July'))
                    .add(m('August')).add(m('September')).add(m('October')).add(m('November')).add(m('December'))
            }
        })
        .merge(function (sub_merge) {
            return {
                balance: sub_merge('count_budget').sub(sub_merge('sum_month'))
            }
        })
        .run()
        .then(function (result) {
            // res.json(result);
            res.ireport("report6.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        });
}
exports.list_group = function (req, res) {
    var r = req.r
        // req.params.year = parseInt(req.params.year);

        // r.db('welfare').table('group_welfare')
        // r.expr({
        //     employees: r.db('welfare').table('employee').coerceTo('array'),
        //     group: []
        // })
        //     .merge(function (employees_merge) {
        //         return {
        //             employees: employees_merge('employees').eqJoin('active_id', r.db('welfare_common').table('active'))
        //                 .without({ right: 'id' }).zip().filter({ active_code: 'WORK' })
        //         }
        //     })
        //     .merge(function (group_merge) {
        //         return {
        //             group: r.db('welfare').table('group_welfare')
        //                 .get(req.params.id).pluck('id', 'group_welfare_name', 'year')
        //                 // .getAll(req.params.year, { index: 'year' })
        //                 .merge(function (m) {
        //                     return {
        //                         year: m('year').add(543),
        //                         welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
        //                             .merge(function (wel_merge) {
        //                                 return {
        //                                     condition: wel_merge('condition')
        //                                         .merge(function (con_merge) {
        //                                             return {
        //                                                 field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
        //                                             }
        //                                         })
        //                                 }
        //                             })
        //                             .merge(function (wel_merge) {
        //                                 return {
        //                                     welfare_id: wel_merge('id'),
        //                                     countCon: wel_merge('condition').count(),
        //                                     employee: r.branch(wel_merge('condition').count().eq(0),
        //                                         [group_merge('employees')],
        //                                         wel_merge('condition').map(function (con_map) {
        //                                             return group_merge('employees').filter(function (f) {
        //                                                 return f(con_map('field')).do(function (d) {
        //                                                     return r.branch(con_map('logic').eq(">="),
        //                                                         d.ge(con_map('value')),
        //                                                         r.branch(con_map('logic').eq(">"),
        //                                                             d.gt(con_map('value')),
        //                                                             r.branch(con_map('logic').eq("<="),
        //                                                                 d.le(con_map('value')),
        //                                                                 r.branch(con_map('logic').eq("<"),
        //                                                                     d.lt(con_map('value')),
        //                                                                     r.branch(con_map('logic').eq("=").or(con_map('logic').eq("==")),
        //                                                                         d.eq(con_map('value')),
        //                                                                         d.ne(con_map('value'))
        //                                                                     )
        //                                                                 )
        //                                                             )
        //                                                         )
        //                                                     )
        //                                                 })
        //                                             })
        //                                                 .coerceTo('array')
        //                                         })
        //                                     )
        //                                 }
        //                             })
        //                             .without('condition', 'group_id', 'status', 'id')
        //                             .merge(function (wel_merge) {
        //                                 return {
        //                                     employee: wel_merge('employee').reduce(function (l, r) {
        //                                         return l.add(r)
        //                                     })
        //                                 }
        //                             })
        //                             .merge(function (wel_merge) {
        //                                 return {
        //                                     employee: wel_merge('employee').merge(function (emp2_merge) {
        //                                         return {
        //                                             count: wel_merge('employee').filter(function (f) {
        //                                                 return f('id').eq(emp2_merge('id'))
        //                                             }).count(),
        //                                             start_work_date: emp2_merge('start_work_date').split('T')(0),
        //                                             birthdate: emp2_merge('birthdate').split('T')(0),
        //                                             academic_name: r.db('welfare_common').table('academic').get(emp2_merge('academic_id')).getField('academic_name'),
        //                                             active_name: r.db('welfare_common').table('active').get(emp2_merge('active_id')).getField('active_name'),
        //                                             department_name: r.db('welfare_common').table('department').get(emp2_merge('department_id')).getField('department_name'),
        //                                             faculty_name: r.db('welfare_common').table('faculty').get(emp2_merge('faculty_id')).getField('faculty_name'),
        //                                             gender_name: r.db('welfare_common').table('gender').get(emp2_merge('gender_id')).getField('gender_name'),
        //                                             matier_name: r.db('welfare_common').table('matier').get(emp2_merge('matier_id')).getField('matier_name'),
        //                                             position_name: r.db('welfare_common').table('position').get(emp2_merge('position_id')).getField('position_name'),
        //                                             prefix_name: r.db('welfare_common').table('prefix').get(emp2_merge('prefix_id')).getField('prefix_name'),
        //                                             type_employee_name: r.db('welfare_common').table('type_employee').get(emp2_merge('type_employee_id')).getField('type_employee_name')
        //                                         }
        //                                     })
        //                                 }
        //                             })
        //                             .merge(function (wel_merge) {
        //                                 return {
        //                                     employee: wel_merge('employee')
        //                                         .filter(function (emp_filter) {
        //                                             return r.branch(wel_merge('countCon').eq(0),
        //                                                 emp_filter('count').eq(wel_merge('countCon').add(1)),
        //                                                 emp_filter('count').eq(wel_merge('countCon'))
        //                                             )
        //                                         }).coerceTo('array')
        //                                         .distinct()
        //                                 }
        //                             })
        //                             .merge(function (wel_merge) {
        //                                 return {
        //                                     value_budget: wel_merge('employee').count().mul(wel_merge('budget')),
        //                                     emp_budget: wel_merge('employee').count()
        //                                 }
        //                             })
        //                     }
        //                 })
        //             // .merge(function (m) {
        //             //     return {
        //             //         value_budget: m('welfare').sum('value_budget'),
        //             //         value_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
        //             //             .filter({ year: req.params.year }).sum('use_budget'),
        //             //         emp_budget: m('welfare').sum('emp_budget'),
        //             //         emp_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
        //             //             .filter({ year: req.params.year }).pluck('emp_id').distinct().count(),
        //             //         time_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
        //             //             .filter({ year: req.params.year }).count()
        //             //     }
        //             // })
        //             // // .without('welfare')
        //             // .coerceTo('array')
        //         }
        //     })
        //     .getField('group')
        //     // .orderBy('group_welfare_name')
        .run()
        .then(function (result) {
            res.json(result);
            res.ireport("list_group.jasper", req.query.EXPORT || req.query.export || "pdf", result);
        })
}
exports.list_year = function (req, res) {
    var r = req.r
    req.params.year = parseInt(req.params.year);
    // console.log(req.query.year)
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
        employees: r.db('welfare').table('employee').limit(10).coerceTo('array'),
        group: []
    })
        .merge(function (employees_merge) {
            return {
                employees: employees_merge('employees').eqJoin('active_id', r.db('welfare_common').table('active'))
                    .without({ right: 'id' }).zip().filter({ active_code: 'WORK' })
            }
        })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare')
                    // .get(req.params.id)
                    .getAll(req.params.year, { index: 'year' })
                    .pluck('id', 'group_welfare_name', 'year')
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (wel_merge) {
                                    return {
                                        group_welfare_name: m('group_welfare_name'),
                                        condition: wel_merge('condition')
                                            .eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        welfare_id: wel_merge('id'),
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
                                                    return checkLogic(con_map, f,r)
                                                })
                                                    .coerceTo('array')
                                            })
                                        )
                                    }
                                })
                                .without('condition', 'group_id', 'status', 'id')
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee').reduce(function (l, r) {
                                            return l.add(r)
                                        })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee')
                                            .merge(function (emp2_merge) {
                                                return {
                                                    count: wel_merge('employee').filter(function (f) {
                                                        return f('id').eq(emp2_merge('id'))
                                                    }).count(),
                                                    start_work_date: emp2_merge('start_work_date'),//.split('T')(0),
                                                    birthdate: emp2_merge('birthdate'),//.split('T')(0),
                                                    academic_name: r.db('welfare_common').table('academic').get(emp2_merge('academic_id')).getField('academic_name'),
                                                    active_name: r.db('welfare_common').table('active').get(emp2_merge('active_id')).getField('active_name'),
                                                    department_name: r.db('welfare_common').table('department').get(emp2_merge('department_id')).getField('department_name'),
                                                    faculty_name: r.db('welfare_common').table('faculty').get(emp2_merge('faculty_id')).getField('faculty_name'),
                                                    gender_name: r.db('welfare_common').table('gender').get(emp2_merge('gender_id')).getField('gender_name'),
                                                    matier_name: r.db('welfare_common').table('matier').get(emp2_merge('matier_id')).getField('matier_name'),
                                                    position_name: r.db('welfare_common').table('position').get(emp2_merge('position_id')).getField('position_name'),
                                                    prefix_name: r.db('welfare_common').table('prefix').get(emp2_merge('prefix_id')).getField('prefix_name'),
                                                    type_employee_name: r.db('welfare_common').table('type_employee').get(emp2_merge('type_employee_id')).getField('type_employee_name')
                                                }
                                            })
                                    }
                                })
                        }
                    })
                    .coerceTo('array')
            }
        })
        .getField('group')
        .orderBy('group_welfare_name')
        .run()
        .then(function (result) {
            res.json(result);
            var parameters = {};
            res.ireport("list_year.jasper", req.query.EXPORT || req.query.export || "pdf", result, parameters);
        })
}
exports.report_test = function (req, res, next) {
    var r = req.r
    req.params.year = parseInt(req.params.year);

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
        employees: r.db('welfare').table('employee').limit(20).coerceTo('array'),
        group: []
    })
        .merge(function (employees_merge) {
            return {
                employees: employees_merge('employees').eqJoin('active_id', r.db('welfare_common').table('active'))
                    .without({ right: 'id' }).zip().filter({ active_code: 'WORK' })
            }
        })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare')
                    .get(req.params.id).pluck('id', 'group_welfare_name', 'year')
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (wel_merge) {
                                    return {
                                        condition: wel_merge('condition')
                                            .merge(function (con_merge) {
                                                return {
                                                    field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
                                                }
                                            })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        welfare_id: wel_merge('id'),
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
                                                    return checkLogic(con_map, f,r)
                                                })
                                                    .coerceTo('array')
                                            })
                                        )
                                    }
                                })
                                .without('condition', 'group_id', 'status', 'id')
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee').reduce(function (l, r) {
                                            return l.add(r)
                                        })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee').merge(function (emp2_merge) {
                                            return {
                                                count: wel_merge('employee').filter(function (f) {
                                                    return f('id').eq(emp2_merge('id'))
                                                }).count(),
                                                start_work_date: emp2_merge('start_work_date'),//.split('T')(0),
                                                birthdate: emp2_merge('birthdate'),//.split('T')(0),
                                                academic_name: r.db('welfare_common').table('academic').get(emp2_merge('academic_id')).getField('academic_name'),
                                                active_name: r.db('welfare_common').table('active').get(emp2_merge('active_id')).getField('active_name'),
                                                department_name: r.db('welfare_common').table('department').get(emp2_merge('department_id')).getField('department_name'),
                                                faculty_name: r.db('welfare_common').table('faculty').get(emp2_merge('faculty_id')).getField('faculty_name'),
                                                gender_name: r.db('welfare_common').table('gender').get(emp2_merge('gender_id')).getField('gender_name'),
                                                matier_name: r.db('welfare_common').table('matier').get(emp2_merge('matier_id')).getField('matier_name'),
                                                position_name: r.db('welfare_common').table('position').get(emp2_merge('position_id')).getField('position_name'),
                                                prefix_name: r.db('welfare_common').table('prefix').get(emp2_merge('prefix_id')).getField('prefix_name'),
                                                type_employee_name: r.db('welfare_common').table('type_employee').get(emp2_merge('type_employee_id')).getField('type_employee_name')
                                            }
                                        })
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        employee: wel_merge('employee')
                                            .filter(function (emp_filter) {
                                                return r.branch(wel_merge('countCon').eq(0),
                                                    emp_filter('count').eq(wel_merge('countCon').add(1)),
                                                    emp_filter('count').eq(wel_merge('countCon'))
                                                )
                                            }).coerceTo('array')
                                            .distinct()
                                    }
                                })
                                .merge(function (wel_merge) {
                                    return {
                                        value_budget: wel_merge('employee').count().mul(wel_merge('budget')),
                                        emp_budget: wel_merge('employee').count()
                                    }
                                })
                        }
                    })

            }
        })
        .getField('group')
        .run()
        .then(function (result) {
            // res.json(result);
            res.ireport("list_group.jasper", req.query.EXPORT || req.query.export || "pdf", result);
        })
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
        .filter({ 'personal_id': param.personal_id, type_group: 'general' })
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
    var r = req.r
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
    // console.log(req.query.date)
    r.db('welfare').table('employee').getAll(time.date(), { index: 'end_work_date' })//.getAll('WORK', { index: 'active_id' })
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
        .filter({ status: true, 'group_id': param.group_id })
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
        .filter({ status: true, 'group_id': req.query.group_id })
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
        .pluck('birthdate', 'department_name', 'faculty_name', 'gender_name', 'personal_id', 'name_employee', 'age')
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
exports.fund01 = function (req, res) {
    var r = req.r
    r.db('welfare').table('history_fund').getAll([year, month], { index: 'yearMonth' })
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
            res.ireport("fund01.jasper", req.query.EXPORT || req.query.export || "pdf", result, param);
        });
}

function keysToUpper(param) {
    var keyname = Object.keys(param);
    for (var i = 0; i < keyname.length; i++) {
        param[keyname[i].toUpperCase()] = param[keyname[i]];
        delete param[keyname[i]];
    }
    return param;
}