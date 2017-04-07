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
                            name: mm('prefix_name').add(mm('firstname')).add('  ', mm('lastname')),
                            department_fuculty_name: mm('department_name').add('  ', mm('faculty_name'))
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
exports.report2 = function (req, res) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        date_start: req.query.date_start
    };

    var date_start = req.query.date_start;
    var date_end = req.query.date_end;
    var res_type = req.query.res_type;
    console.log(req.query.res_type);

    r.db('welfare').table('history_welfare').filter(function (row) {
        return row('date_use').split('T')(0).eq(req.query.date_start)
    }).filter({ status: 'approve' })
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
            res.ireport("report2.jasper", req.query.export || "pdf", result, parameters);
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
    r.db('welfare').table('group_welfare').get(params.group_id).pluck('group_welfare_name')
        .merge(function (m) {
            return {
                history_welfare: r.db('welfare').table('history_welfare').coerceTo('array')
                    .filter(function (row) {
                        return row("group_id").eq(params.group_id).and(
                            row("date_use").split("T")(0).eq(params.date_start)
                        )
                    }).filter({ status: 'approve' })
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
            res.ireport("report2_1.jasper", req.query.export || "pdf", result.history_welfare, parameters);
        });
}
exports.report3 = function (req, res, next) {
    var r = req.r
    req.params.year = parseInt(req.params.year);
    var year = req.params.year;//2017
    var month = req.params.month;//03
    var date_start = year + "-" + month + "-01";
    // var date_end_arr = req.query.date_end.split('-');
    var nextMonth = (parseInt(month) + 1);
    if (nextMonth < 10) {
        nextMonth = "0" + nextMonth;
        if (nextMonth == 13) {
            nextMonth = "01"; 
        }
    }
    var date_end = (nextMonth == "01" ? parseInt(year) + 1 : year) + "-" + nextMonth + "-01"; //2017-12-01 2018-01-01
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        month: date_start,
        year: date_start
    };

    r.expr({
        employees: r.db('welfare').table('employee').coerceTo('array'),
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
                    .getAll(req.params.year, { index: 'year' })
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            start_date: m('start_date').split('T')(0),
                            end_date: m('end_date').split('T')(0),
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
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
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
                                                }).count()
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
                                }),
                            history_welfare: r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' }).filter({status:'approve'}).coerceTo('array')
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(req.params.year).and(f('group_id').eq(m('id')))
                            }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(req.params.year).and(f('group_id').eq(m('id')))
                            }).pluck('emp_id').distinct().count(),
                            time_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(req.params.year).and(f('group_id').eq(m('id')))
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
            res.ireport("report3.jasper", req.query.export || "pdf", result, parameters);
        });
}
exports.report3_1 = function (req, res) {
    var r = req.r
    req.query.year = parseInt(req.query.year);
    var year = req.query.year;//2017
    var month = req.query.month;//03
    var date_start = year + "-" + month + "-01";
    // var date_end_arr = req.query.date_end.split('-');
    var nextMonth = (parseInt(month) + 1);
    if (nextMonth < 10) {
        nextMonth = "0" + nextMonth;
        if (nextMonth == 13) {
            nextMonth = "01"; 
        }
    }
    var date_end = (nextMonth == "01" ? parseInt(year) + 1 : year) + "-" + nextMonth + "-01"; //2017-12-01 2018-01-01
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        month: date_start,
        year: date_start
    };
    // console.log(year);
    r.expr({
        employees: r.db('welfare').table('employee').coerceTo('array'),
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
                group: r.db('welfare').table('group_welfare').get(req.params.id)
                .pluck('id','group_welfare_name','year')
                    .merge(function (m) {
                        return {
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
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
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
                                                }).count()
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
                                }),
                            history_welfare: r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' }).filter({status:'approve'}).coerceTo('array')
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use : m('history_welfare').filter(function (f) {
                                return f('year').eq(year).and(f('group_id').eq(req.params.id))
                            }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(year).and(f('group_id').eq(req.params.id))
                            }).pluck('emp_id').distinct().count(),
                            time_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(year).and(f('group_id').eq(req.params.id))
                            }).count()
                        }
                    })
                    .without('welfare', 'history_welfare')
            }
        })
        .getField('group')
        .merge(function (m){
            return {
                welfare_name:r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                  .merge(function(mm){
                      return mm('welfare_name')
                             })(0)
            }
        })
        .run()
        .then(function (result) {
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            res.ireport("report3_1.jasper", req.query.export || "pdf", result, parameters);
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
            res.ireport("report4.jasper", req.query.export || "pdf", result, parameters);
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
<<<<<<< HEAD
            res.json(result);
=======
            // parameters.group_welfare_name = result.group_welfare_name;
            if (req.query.res_type == 'json') {
                res.json(result);
            }
>>>>>>> 97e98ceccd1b291a8c27344eb9320e1bb1b13913
            res.ireport("report4_1.jasper", req.query.export || "pdf", result, parameters);
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
            res.ireport("report4_2.jasper", req.query.export || "pdf", result, parameters);
        });
}
exports.report5 = function (req, res) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        // SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        date_start: req.query.date_start,
        date_end: req.query.date_end
    };
    var year = req.query.year;//2017
    var month = req.query.month;//03
    var date_start = req.query.date_start; //year+"-"+month+"-01"
    var date_end_arr = req.query.date_end.split('-');
    var date_end = date_end_arr[0] + "-" + date_end_arr[1] + "-" + (parseInt(date_end_arr[2]) + 1); //year+"-"+month+"-31"

    r.db('welfare').table('history_welfare')
        .between(date_start, date_end, { index: 'date_use' })
        .filter({ status: 'approve' })
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
            res.ireport("report5.jasper", req.query.export || "pdf", result, parameters);
        });
}
exports.report5_1 = function (req, res) {
    var params = req.query;
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        // SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        date_start: req.query.date_start,
        date_end: req.query.date_end
    };
    var year = req.query.year;//2017
    var month = req.query.month;//03
    var date_start = req.query.date_start; //year+"-"+month+"-01"
    var date_end_arr = req.query.date_end.split('-');
    var date_end = date_end_arr[0] + "-" + date_end_arr[1] + "-" + (parseInt(date_end_arr[2]) + 1); //year+"-"+month+"-31"

    r.db('welfare').table('group_welfare').get(params.group_id).pluck('group_welfare_name')
        .merge(function (m) {
            return {
                history_welfare: r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' })
                    .coerceTo('array')
                    .filter(function (row) {
                        return row("group_id").eq(params.group_id)
                    }).filter({ status: 'approve' })
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

                    .merge(function (wel_merge) {
                        return r.db('welfare').table('welfare').get(wel_merge('welfare_id')).pluck('welfare_name')
                    })
            }
        })

        .run()
        .then(function (result) {
            // parameters.group_welfare_name = result.group_welfare_name;
            if (req.query.res_type == 'json') {
                res.json(result);
            }
            //   if (result.length > 0 ) 
            res.ireport("report5_1.jasper", req.query.export || "pdf", result.history_welfare, parameters);
        });
}
exports.test = function (req, res) {
    var params = req.query;
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        date_start: params.date_start,
        date_end: params.end
        // group_welfare_name:params.group_welfare_name
    };

    r.db('welfare').table('group_welfare').get(params.group_id).pluck('group_welfare_name')
        .merge(function (m) {
            return {
                history_welfare: r.db('welfare').table('history_welfare')
                    .coerceTo('array')
                    .filter(function (row) {
                        return row("group_id").eq(params.group_id).and(
                            row("date_use").split("T")(0).eq(params.date_start)
                        )
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

                    .merge(function (wel_merge) {
                        return r.db('welfare').table('welfare').get(wel_merge('welfare_id')).pluck('welfare_name')
                    })

            }
        })


        .run()
        .then(function (result) {
            parameters.group_welfare_name = result.group_welfare_name;
            res.json(result);
            res.ireport("report7.jasper", req.query.export || "pdf", result.history_welfare, parameters);
        });
}
exports.report14 = function (req, res, next) {
    var params = req.query;
    var r = req.r
    req.params.year = parseInt(req.params.year);
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        // SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        // YEAR: req.params.year + "-01-01"
    };
    // var date_start = "2017-01-01";
    // var date_end = "2017-12-31";

    // var year = req.params.year;
    // var arr_month = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    // var data = [];
    // for (var i = 1; i <= 12; i++) {
    //     var month = 0;
    //     var nextMonth = 0;
    //     if (i < 10) {
    //         month = "0" + i;
    //         nextMonth = i + 1;
    //     } else {
    //         month = i;
    //         if (i == 12) {
    //             nextMonth = 1;
    //         } else {
    //             nextMonth = i;
    //         }
    //     }
    //     if (nextMonth < 10) {
    //         nextMonth = "0" + nextMonth;
    //     }
    //     data.push({
    //         date_start: year + "-" + month + "-01",
    //         date_end: year + "-" + nextMonth + "-01",
    //         month_name: arr_month[i]
    //     });
    // }
    
    
    
    
    
      r.db('welfare').table('group_welfare').filter({year:params.year})
        .merge(function (m){
          return {
            welfare:r.db('welfare').table('welfare').filter({group_id:m('id')}).coerceTo('array')
            .merge(function(mm){
              return {
                history_welfare:r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
              }
            })
                  .do(function(result){
              return r.branch(result.count().eq(0),[],
                result.reduce(function(left,right){
                  return {
                    budget:left('budget').add(right('budget')),
                    history_welfare:left('history_welfare').union(right('history_welfare'))
                   
                  }
                }).merge(function(row){
                  
                  return row('history_welfare')
                     .merge(function(m){
                return {
                month:r.ISO8601(m('date_use')).month()
              }
            }).group('month').sum('use_budget').ungroup()
                    .do(function(result){
                      return	{
                    history_welfare:result,
                        result:r.expr([
                          {month:"January",number:1},
                          {month:"February",number:2},
                          {month:"March",number:3},
                          {month:"April",number:4},
                          {month:"May",number:5},
                          {month:"June",number:6},
                          {month:"July",number:7},
                          {month:"August",number:8},
                          {month:"September",number:9},
                          {month:"October",number:10},
                          {month:"November",number:11},
                          {month:"December",number:12}
                        ]).merge(function(row){
                          return result.filter({group:row('number')}).do(
                            function(result){
                              	 return {
                            use_budget:r.branch(result.count().eq(0),0,result(0)('reduction'))
                          }
                            }
                          )
                        })
                  }
                    })
                    .merge(function(row){
                      return {
                        result:r.object(r.args(row('result').concatMap(function(row){
                        return [row('month'),row('use_budget')]
                      })))
                        ,
                        use_budget:row('result').sum('use_budget')
                      }
                    })
                })
                )
            })
          }
        }) 
        .merge(function(row){
          return r.branch(row('welfare').typeOf().eq('OBJECT'),
            row('welfare').merge(function(row){
              return row('result')
            })
            ,{welfare:[]})
        })
        .without('onetime','result','history_welfare','welfare','status','status_approve','admin_use','condition','description','end_date')
        .run()
        .then(function (result) {
            // res.json(result);
            res.ireport("report6.jasper", req.query.export || "pdf", result, parameters);
        });
}
exports.test2 = function (req, res) {
    var r = req.r
    req.params.year = parseInt(req.params.year);
    var year = req.params.year;//2017
    var month = req.params.month;//03
    var date_start = year + "-" + month + "-01";
    // var date_end_arr = req.query.date_end.split('-');
    var nextMonth = (parseInt(month) + 1);
    if (nextMonth < 10) {
        nextMonth = "0" + nextMonth;
        if (nextMonth == 13) {
            nextMonth = "01"; 
        }
    }
    var date_end = (nextMonth == "01" ? parseInt(year) + 1 : year) + "-" + nextMonth + "-01"; //2017-12-01 2018-01-01
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        month: date_start,
        year: date_start
    };

    r.expr({
        employees: r.db('welfare').table('employee').coerceTo('array'),
        group: []
    })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare')
                    .getAll(req.params.year, { index: 'year' })
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            start_date: m('start_date').split('T')(0),
                            end_date: m('end_date').split('T')(0),
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
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
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
                                                }).count()
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
                                }),
                            history_welfare: r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' }).filter({status:'approve'}).coerceTo('array')
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(req.params.year).and(f('group_id').eq(m('id')))
                            }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(req.params.year).and(f('group_id').eq(m('id')))
                            }).pluck('emp_id').distinct().count(),
                            time_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(req.params.year).and(f('group_id').eq(m('id')))
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
            // res.json(result);
            res.ireport("report3.jasper", req.query.export || "pdf", result, parameters);
        })
}
exports.test3 = function (req, res) {
    var r = req.r
    req.query.year = parseInt(req.query.year);
    var year = req.query.year;//2017
    var month = req.query.month;//03
    var date_start = year + "-" + month + "-01";
    // var date_end_arr = req.query.date_end.split('-');
    var nextMonth = (parseInt(month) + 1);
    if (nextMonth < 10) {
        nextMonth = "0" + nextMonth;
        if (nextMonth == 13) {
            nextMonth = "01"; 
        }
    }
    var date_end = (nextMonth == "01" ? parseInt(year) + 1 : year) + "-" + nextMonth + "-01"; //2017-12-01 2018-01-01
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        month: date_start,
        year: date_start
    };
    // console.log(year);
    r.expr({
        employees: r.db('welfare').table('employee').coerceTo('array'),
        group: []
    })
        .merge(function (group_merge) {
            return {
                group: r.db('welfare').table('group_welfare').get(req.params.id)
                .pluck('id','group_welfare_name','year')
                    .merge(function (m) {
                        return {
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
                                        countCon: wel_merge('condition').count(),
                                        employee: r.branch(wel_merge('condition').count().eq(0),
                                            [group_merge('employees')],
                                            wel_merge('condition').map(function (con_map) {
                                                return group_merge('employees').filter(function (f) {
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
                                                }).count()
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
                                }),
                            history_welfare: r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' }).filter({status:'approve'}).coerceTo('array')
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use : m('history_welfare').filter(function (f) {
                                return f('year').eq(year).and(f('group_id').eq(req.params.id))
                            }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(year).and(f('group_id').eq(req.params.id))
                            }).pluck('emp_id').distinct().count(),
                            time_use: m('history_welfare').filter(function (f) {
                                return f('year').eq(year).and(f('group_id').eq(req.params.id))
                            }).count()
                        }
                    })
                    .without('welfare', 'history_welfare')
            }
        })
        .getField('group')
        .merge(function (m){
            return {
                welfare_name:r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                  .merge(function(mm){
                      return mm('welfare_name')
                             })(0)
            }
        })
        .run()
        .then(function (result) {
            // res.json(result);
            res.ireport("report3_1.jasper", req.query.export || "pdf", result, parameters);
        })
}