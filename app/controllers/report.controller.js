exports.report1 = function (req, res, next) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\'
    };
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .merge(function (m) {
            return r.db('welfare').table('group_welfare').get(m('group_id')).without('id')
        })
        // .eqJoin('group_id', r.db('welfare').table('group_welfare')).without({ right: 'id' }).zip()
        .merge(function (wel_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')


            }
        })
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
                countCon: wel_merge('condition').count(),
                employee1: r.branch(wel_merge('condition').count().eq(0),
                    [wel_merge('employees')],
                    wel_merge('condition').map(function (con_map) {
                        return wel_merge('employees').filter(function (f) {
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
                        })
                            .coerceTo('array')
                    })
                )
            }
        })
        .merge(function (wel_merge) {
            return {
                employee2: wel_merge('employee1').reduce(function (l, r) {
                    return l.add(r)
                })
            }
        })
        .merge(function (wel_merge) {
            return {
                employee3: wel_merge('employee2').merge(function (emp2_merge) {
                    return {
                        count: wel_merge('employee2').filter(function (f) {
                            return f('id').eq(emp2_merge('id'))
                        }).count()
                    }
                })
            }
        })
        .merge(function (wel_merge) {
            return {
                employee: wel_merge('employee3')
                    .filter(function (emp_filter) {
                        return r.branch(wel_merge('countCon').eq(0),
                            emp_filter('count').eq(wel_merge('countCon').add(1)),
                            emp_filter('count').eq(wel_merge('countCon'))
                        )
                    })
                    // .filter({ count: wel_merge('countCon') })
                    .coerceTo('array')
                    .eqJoin('academic_id', r.db('welfare_common').table('academic')).without({ right: 'id' }).zip()
                    .eqJoin('active_id', r.db('welfare_common').table('active')).without({ right: 'id' }).zip()
                    .eqJoin('department_id', r.db('welfare_common').table('department')).without({ right: 'id' }).zip()
                    .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).without({ right: 'id' }).zip()
                    .eqJoin('gender_id', r.db('welfare_common').table('gender')).without({ right: 'id' }).zip()
                    .eqJoin('matier_id', r.db('welfare_common').table('matier')).without({ right: 'id' }).zip()
                    .eqJoin('position_id', r.db('welfare_common').table('position')).without({ right: 'id' }).zip()
                    .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).without({ right: 'id' }).zip()
                    .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).without({ right: 'id' }).zip()
                    .distinct()
                    .without('count')
                    .without('academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'prefixname_id', 'type_employee_id')
            }
        })
        .without('employees', 'employee1', 'employee2', 'employee3', 'countCon')
        .merge(function (m) {
            return {
                start_date: m('start_date').split('T')(0),
                end_date: m('end_date').split('T')(0)
            }
        })
        .merge(function (m) {
            return {
                employee: m('employee')
                    .merge(function (mm) {
                        return {
                            name: mm('prefix_name').add(mm('firstname')).add('  ', mm('lastname'))
                        }
                    })//.without('prefixname','name','surname')
            }
        })
        .merge(function (count_merge) {
            return {
                count_employee: count_merge('employee').count()
            }
        })
        .run()
        .then(function (result) {
            //   res.json(result);
            res.ireport("report1.jasper", req.query.export || "pdf", result);
        });
}
exports.report2 = function (req, res, next) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\'
    };
    var date_start = "2017-03-08";
    var date_end = "2017-03-15";
    r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' })
        .merge(function (m) {
            return r.db('welfare').table('employee').get(m('emp_id'))
        })
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).without({ right: 'id' }).zip()
        .merge(function (name_merge) {
            return {
                name: name_merge('prefix_name').add(name_merge('firstname')).add('  ', name_merge('lastname'))
            }
        })
        .without('prefix_name', 'firstname', 'lastname')
        .merge(function (emp) {
            return {
                gender: r.db('welfare_common').table('gender').get(emp('gender_id')).getField('gender_name')
            }
        })
        .merge(function (f) {
            return {
                start_work_date: f('start_work_date').split('T')(0),
                department_name: r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
                faculty_name: r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
                position_name: r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
            }
        })
        .merge(function (welfare) {
            return {
                welfare: r.db('welfare').table('welfare')
                    .merge((group_name) => {
                        return {
                            group_welfare_name: r.db('welfare').table('group_welfare').get(group_name('group_id')).getField('group_welfare_name'),
                            name: welfare('name'),
                            emp_no: welfare('emp_no'),
                            position_name: welfare('position_name'),
                        }
                    })
                    .merge((name_field) => {
                        return {
                            condition:
                            name_field('condition').map((con_map) => {
                                return {
                                    field: r.db('welfare').table('condition').get(con_map('field')).getField('field'),
                                    logic: con_map('logic'),
                                    logic_show: con_map('logic_show'),
                                    value: con_map('value'),
                                    value_show: con_map('value_show')
                                }
                            }
                            )
                        }
                    })
                    .merge((value_field) => {
                        return {
                            condition:
                            value_field('condition').map((con_map) => {
                                return {
                                    field: con_map('field'),
                                    logic: con_map('logic'),
                                    logic_show: con_map('logic_show'),
                                    value: con_map.getField('field').eq('gender').branch(
                                        r.db('welfare_common').table('gender').get(con_map('value')).getField('gender_name')
                                        //.coerceTo('array')
                                        , con_map('value'))

                                    //   con_map('value')
                                    ,
                                    //   value_show:con_map('value_show')
                                }
                            }
                            )
                        }
                    })
                    .merge(function (we_m) {
                        return {
                            count: we_m('condition').count(),
                            countpass: we_m('condition').map(function (con_map) {
                                return {
                                    pass: welfare(con_map('field')).do(function (d) {
                                        return r.branch(con_map('logic').eq(">="),
                                            d.ge(con_map('value')),
                                            r.branch(con_map('logic').eq(">"),
                                                d.gt(con_map('value')),
                                                r.branch(con_map('logic').eq("<="),
                                                    d.le(con_map('value')),
                                                    r.branch(con_map('logic').eq("<"),
                                                        d.lt(con_map('value')),
                                                        r.branch(con_map('logic').eq("=="),
                                                            d.eq(con_map('value')),
                                                            d.ne(con_map('value'))
                                                        )
                                                    )
                                                )
                                            )
                                        )
                                    })
                                }
                            })
                        }
                    })
                    .merge((e) => {
                        return {
                            countpass_total: e('countpass').filter({ "pass": true }).count()
                        }
                    })
                    .merge((status) => {
                        return {
                            count_pass_status: status('countpass_total').eq(status('count'))
                        }
                    })
                    .merge((chengeidname) => {
                        return { welfare_id: chengeidname('id') }
                    })
                    .filter({ "count_pass_status": true })
                    .merge((use_his) => {
                        return {
                            budget_use: r.db('welfare').table('history_welfare')
                                .filter(
                                {
                                    emp_id: welfare('id'),
                                    welfare_id: use_his('id')
                                }
                                )
                                .sum('use_budget')
                        }
                    })
                    .merge((balance) => {
                        return {
                            budget_balance: balance('budget').sub(balance('budget_use')),
                            budget_balance_check: balance('budget').sub(balance('budget_use')).le(0).branch(true, false)
                        }
                    })
                    .filter({ "budget_balance_check": false })
                    .without('condition', 'countpass', 'id', 'count', 'count_pass_status', 'countpass_total', 'budget_balance_check', 'year', 'start_date', 'end_date')
                    .coerceTo('array')
            }
        })
        .run()
        .then(function (result) {
            //   res.json(result);
            res.ireport("report/report2.jasper", req.query.export || "pdf", [result]);
        });
}
exports.report3 = function (req, res, next) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\'
    };
    r.db('welfare').table('employee')
        .run()
        .then(function (result) {
            //   res.json(result);
            res.ireport("report/report3.jasper", req.query.export || "pdf", [result]);
        });
}