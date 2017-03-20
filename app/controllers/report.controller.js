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
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        date_start:req.query.date_start
    };

    var date_start = req.query.date_start;
    var date_end = req.query.date_end;
    r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' })
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
            //   res.json(result);
            //   if (result.length > 0 ) 
            res.ireport("report2.jasper", req.query.export || "pdf", result, parameters);
        });
}
exports.report3 = function (req, res, next) {
    var r = req.r
    var parameters = {
        CURRENT_DATE: new Date().toISOString().slice(0, 10),
        SUBREPORT_DIR: __dirname.replace('controller', 'report') + '\\' + req.baseUrl.replace("/api/", "") + '\\',
        date_start: req.query.date_start
    };
    var date_start = req.query.date_start;
    var date_end = req.query.date_end;
    r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_use' })

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

        .merge(function (date_merge) {
            return {
                date_use: date_merge('date_use').split('T')(0),
            }
        })
        .group('group_id')
        .ungroup()

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
        .merge(function (group_merge) {
            return {
                group_welfare_name: group_merge('reduction').getField('group_welfare_name')(0),
                year: group_merge('reduction').getField('year')(0)
            }
        })
        .orderBy('year')
        .run()
        .then(function (result) {
            //   res.json(result);
            //   if(result.length < 1)
            // console.log('>>>>>',result.length < 1)
            if(result.length > 0) {
                console.log()
                parameters.monthStart = result[0].reduction[0].date_use
                parameters.monthEnd = result[result.length - 1].reduction[(result[result.length - 1].reduction.length - 1)].date_use
                parameters.yearStart = result[0].year + 543;
                parameters.yearEnd = result[result.length - 1].year + 543;
            }
            // parameters.yearStart = result[0].year + 543;
            // parameters.yearEnd = result[result.length - 1].year + 543;
            console.log(parameters)
            res.ireport("report3.jasper", req.query.export || "pdf", result, parameters);
        });
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
        if (i < 10) {
            month = "0" + i;
        } else {
            month = i;
        }
        data.push({
            date_start: year + "-" + month + "-01",
            date_end: year + "-" + month + "-31",
            month_name: arr_month[i]
        });
    }
    r.expr(data)
        .merge(function (data_merge) {
            return {
                sum_use: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).count(),
                sum_emp: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).group('emp_id').ungroup().count(),
                sum_budget: r.db('welfare').table('history_welfare').between(data_merge('date_start'), data_merge('date_end'), { index: 'date_use' }).sum('use_budget')
            }
        })
        .without('date_start', 'date_end')
        .run()
        .then(function (result) {
            // res.json(result);
             res.ireport("report4.jasper", req.query.export || "pdf", result, parameters);
        });
}