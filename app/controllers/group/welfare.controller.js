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
var reduceCondition = function (emp, con) {
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
                    })//.coerceTo('array')
                }
            )
        })('data'),
        countCon.eq(1),
        emp.filter(function (f) {
            return checkLogic(con(0), f)
        }),
        emp
    )
}
exports.list = function (req, res) {
    var r = req.r

    req.params.year = parseInt(req.params.year);
    r.expr({
        employees: r.db('welfare').table('employee')
            .without('dob', 'emp_no', 'firstname', 'lastname')
            .coerceTo('array'),
        group: []
    })
        .merge(function (group_merge) {
            var emps = group_merge('employees');
            return {
                group: r.db('welfare').table('group_welfare').getAll(req.params.year, 9999, { index: 'year' })
                    .merge(function (m) {
                        return {
                            status_approve_name: r.branch(m('status_approve').eq(true), 'ใช้งาน', 'ไม่ใช้งาน'),
                            group_use_name: r.branch(m('group_use').eq(true), 'แบบกลุ่ม', 'แบบเดี่ยว'),
                            // year: m('year').add(543),
                            start_date: m('start_date').toISO8601().split('T')(0),
                            end_date: r.branch(m('end_date').ne(null), m('end_date').toISO8601().split('T')(0), null),
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (wel_merge) {
                                    var condition = wel_merge('condition');
                                    return {
                                        countCon: condition.count(),
                                        emp_budget: reduceCondition(emps, condition).pluck('id')
                                    }
                                })
                                .without('employees')
                                .merge(function (m) {
                                    return {
                                        value_budget: r.branch(m('round_use').eq(true), m('emp_budget').count().mul(m('budget')), 0)
                                    }
                                })
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' }).sum('budget_use'),
                            emp_budget: m('welfare').map(function (m2) {
                                return m2('emp_budget')
                            }).reduce(function (l, r) {
                                return l.add(r)
                            }).group('id')
                                .ungroup()
                                .count(),
                            emp_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' }).pluck('emp_id').distinct().count(),
                            time_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' }).count()
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
            res.json(result);
        })
}
exports.listId = function (req, res) {
    var r = req.r
    r.expr({
        employees: r.db('welfare').table('employee')/*.filter({ active_name: 'ทำงาน' })*/
            .without('dob', 'emp_no', 'firstname', 'lastname')
            .coerceTo('array'),
        group: []
    })
        .merge(function (group_merge) {
            var emps = group_merge('employees');
            return {
                group: r.db('welfare').table('group_welfare').get(req.params.id)
                    .merge(function (m) {
                        return {
                            year: m('year'),
                            start_date: m('start_date').toISO8601().split('T')(0),
                            end_date: r.branch(m('end_date').ne(null), m('end_date').toISO8601().split('T')(0), null),
                            cal_date: r.branch(m('cal_date').ne(null), m('cal_date').toISO8601().split('T')(0), null),
                            welfare: r.db('welfare').table('welfare').getAll(m('id'), { index: 'group_id' }).coerceTo('array').orderBy('welfare_name')
                                .merge(function (wel_merge) {
                                    var condition = wel_merge('condition');
                                    return {
                                        countCon: condition.count(),
                                        emp_budget: reduceCondition(emps, condition).count()
                                    }
                                })
                                .without('employees')
                                .merge(function (m) {
                                    return {
                                        emp_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'welfare_id' })
                                            .pluck('emp_id').distinct().count()
                                    }
                                })
                                .orderBy('condition')
                        }
                    })
            }
        })
        .getField('group')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.insert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('welfare', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        if (req.body.end_date === null) {
            req.body.end_date = null
        } else {
            req.body.end_date = r.ISO8601(req.body.end_date).inTimezone('+07')
        }
        if (req.body.cal_date === null) {
            req.body.cal_date = null
        } else {
            req.body.cal_date = r.ISO8601(req.body.cal_date).inTimezone('+07')
        }
        req.body = Object.assign(req.body,
            {
                start_date: r.ISO8601(req.body.start_date).inTimezone('+07')
            }
        );
        r.db('welfare').table('group_welfare').insert(req.body)
            .run()
            .then((response) => {
                result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                    result.id = response.generated_keys;
                }
                res.json(result);
            })
            .error((err) => {
                result.message = err;
                res.json(result);
            })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.update = function (req, res) {
    var r = req.r;
    if (req.body.end_date === null) {
        req.body.end_date = null
    } else {
        req.body.end_date = r.ISO8601(req.body.end_date).inTimezone('+07')
    }
    if (req.body.cal_date === null) {
        req.body.cal_date = null
    } else {
        req.body.cal_date = r.ISO8601(req.body.cal_date).inTimezone('+07')
    }
    req.body = Object.assign(req.body,
        {
            start_date: r.ISO8601(req.body.start_date).inTimezone('+07')
        }
    );
    r.db('welfare').table('group_welfare')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.delete = function (req, res) {
    var r = req.r;
    r.db('welfare').table('group_welfare').get(req.params.id).delete()
        .do(function (d) {
            return r.db('welfare').table('welfare').filter({ group_id: req.params.id }).delete()
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.groupYear = function (req, res) {
    var r = req.r;
    r.db('welfare').table('group_welfare')
        .filter(function (f) {
            return f('year').ne(9999)
        })
        .group('year')
        .ungroup()
        .map(function (y_map) {
            return {
                year: y_map('group')
            }
        })
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.approve = function (req, res) {
    var r = req.r;
    // console.log(req.body)
    r.db('welfare').table('group_welfare')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.groupByYear = function (req, res) {
    var r = req.r;
    year = parseInt(req.params.year);
    r.db('welfare').table('group_welfare')
        .getAll(year, { index: 'year' })
        .pluck('group_welfare_name', 'id', 'group_use')
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.adminEmployee = function (req, res) {
    // var checkLogic = function (select, row) {
    //     return r.branch(
    //         select('logic').eq('=='),
    //         row(select('field_name')).eq(select('value')),
    //         select('logic').eq('>'),
    //         row(select('field_name')).gt(select('value')),
    //         select('logic').eq('>='),
    //         row(select('field_name')).ge(select('value')),
    //         select('logic').eq('<'),
    //         row(select('field_name')).lt(select('value')),
    //         select('logic').eq('<='),
    //         row(select('field_name')).le(select('value')),
    //         row(select('field_name')).ne(select('value'))
    //     )
    // };
    var r = req.r;
    r.expr({
        employees: r.db('welfare').table('employee')//.filter({ active_name: 'ทำงาน' })
            /*.eqJoin('active_id', r.db('welfare_common').table('active')).pluck('left', { right: 'active_code' }).zip()
            .filter({ active_code: 'WORK' })*/
            .coerceTo('array')
        //                 .without({ right: 'id' }).zip().filter({ active_code: 'WORK' }),
        // academic: r.db('welfare_common').table('academic').coerceTo('Array'),
        // active: r.db('welfare_common').table('active').coerceTo('Array'),
        // department: r.db('welfare_common').table('department').coerceTo('Array'),
        // faculty: r.db('welfare_common').table('faculty').coerceTo('Array'),
        // gender: r.db('welfare_common').table('gender').coerceTo('Array'),
        // matier: r.db('welfare_common').table('matier').coerceTo('Array'),
        // position: r.db('welfare_common').table('position').coerceTo('Array'),
        // prefix: r.db('welfare_common').table('prefix').coerceTo('Array'),
        // type_employee: r.db('welfare_common').table('type_employee').coerceTo('Array'),
    })
        .merge((group_merge) => {
            return {
                welfare: r.db('welfare').table('welfare').getAll(req.params.groupId, { index: 'group_id' })
                    // .merge(function (wel_merge) {
                    //     return {
                    //         condition: wel_merge('condition')
                    //             /*.eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()*/
                    //             .coerceTo('array')
                    //     }
                    // })
                    .merge(function (wel_merge) {
                        return {
                            countCon: wel_merge('condition').count(),
                            employee: r.branch(wel_merge('condition').count().eq(0),
                                [group_merge('employees').pluck("id")],
                                wel_merge('condition').map(function (con_map) {
                                    return group_merge('employees').filter(function (f) {
                                        return checkLogic(con_map, f)
                                    }).coerceTo('array').pluck('id')
                                })
                            )
                        }
                    }).coerceTo('array')
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
                                })//.getField('group')
                        }
                    })
            }
        })
        .without('employees')
        // .merge((setbudget) => {
        //     return setbudget('welfare').merge((set) => {
        //         return set('employee').merge((sertvalueBBudget) => {
        //             return {
        //                 value_budget: set('budget'),
        //                 group_use: set('group_use'),
        //             }
        //         })
        //     })
        // })
        .getField('welfare')('employee')
        .reduce(function (l, r) {
            return l.add(r)
        })
        .group('group').ungroup()
        // .merge((set) => {
        //     return {
        //         value_budget: set.getField('reduction')(0).getField('value_budget')
        //     }
        // })
        .without('reduction')
        // .merge(function (emp_merge) {
        //     return {
        //         value_use: r.db('welfare').table('history_welfare').getAll(emp_merge('group'), { index: 'emp_id' })
        //             .filter({ group_id: req.params.groupId }).sum('budget_use'),
        //         emp_id: emp_merge('group')
        //     }
        // })
        // .merge(function (emp_merge) {
        //     return {
        //         group_use: r.branch(emp_merge('value_budget').sub(emp_merge('value_use')).le(0),
        //             false, true)
        //     }
        // })
        .eqJoin('group', r.db('welfare').table('employee')).without({ left: "group" }, { right: ['dob', 'active_id', 'birthdate', 'gender_id', 'gender_id', 'position_id', 'start_work_date', 'type_employee_id'] }).zip()
        .eqJoin('academic_id', r.db('welfare_common').table('academic')).pluck('left', { right: 'academic_name' }).zip()
        .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: 'department_name' }).zip()
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: 'faculty_name' }).zip()
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck('left', { right: 'prefix_name' }).zip()
        .without('academic_id', 'prefix_id')

        // r.db('welfare').table('group_welfare').get(req.params.welId)
        // r.db('welfare').table('group_welfare').get(req.params.welId)
        //     .merge(function (m) {
        //         return {
        //             employees: r.db('welfare').table('employee').coerceTo('array').eqJoin('active_id', r.db('welfare_common').table('active'))
        //                 .without({ right: 'id' }).zip().filter({ active_code: 'WORK' })
        //         }
        //     })
        //     .merge(function (group_merge) {
        //         return {
        //             welfare: r.db('welfare').table('welfare').getAll(group_merge('id'), { index: 'group_id' }).coerceTo('array')
        //                 .merge(function (wel_merge) {
        //                     return {
        //                         condition: wel_merge('condition')
        //                             .merge(function (con_merge) {
        //                                 return {
        //                                     field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
        //                                 }
        //                             })
        //                     }
        //                 })
        //                 .merge(function (wel_merge) {
        //                     return {
        //                         countCon: wel_merge('condition').count(),
        //                         employee: r.branch(wel_merge('condition').count().eq(0),
        //                             [group_merge('employees')],
        //                             wel_merge('condition').map(function (con_map) {
        //                                 return group_merge('employees').filter(function (f) {
        //                                     return checkLogic(con_map, f)
        //                                 })
        //                                     .coerceTo('array').pluck('id')
        //                             })
        //                         )
        //                     }
        //                 })
        //                 .merge(function (wel_merge) {
        //                     return {
        //                         employee: wel_merge('employee').reduce(function (l, r) {
        //                             return l.add(r)
        //                         })
        //                     }
        //                 })
        //                 .merge(function (wel_merge) {
        //                     return {
        //                         employee: wel_merge('employee').merge(function (emp2_merge) {
        //                             return {
        //                                 count: wel_merge('employee').filter(function (f) {
        //                                     return f('id').eq(emp2_merge('id'))
        //                                 }).count()
        //                             }
        //                         })
        //                     }
        //                 })
        //                 .merge(function (wel_merge) {
        //                     return {
        //                         employee: wel_merge('employee')
        //                             .filter(function (emp_filter) {
        //                                 return r.branch(wel_merge('countCon').eq(0),
        //                                     emp_filter('count').eq(wel_merge('countCon').add(1)),
        //                                     emp_filter('count').eq(wel_merge('countCon'))
        //                                 )
        //                             }).coerceTo('array')
        //                             .merge({ value_budget: wel_merge('budget'), welfare_id: wel_merge('id'), group_id: group_merge('id'), year: group_merge('year') })
        //                             .without('count')
        //                             .distinct()
        //                     }
        //                 })
        //         }
        //     })
        //     .merge(function (group_merge) {
        //         return {
        //             employee: group_merge('welfare').getField('employee')
        //         }
        //     })
        //     .getField('employee')
        //     .reduce(function (l, r) {
        //         return l.add(r)
        //     })
        //     .merge(function (emp_merge) {
        //         return {
        //             value_use: r.db('welfare').table('history_welfare').getAll(emp_merge('id'), { index: 'emp_id' })
        //                 .filter({ welfare_id: emp_merge('welfare_id') }).sum('use_budget'),
        //             emp_id: emp_merge('id')
        //         }
        //     })
        //     .merge(function (emp_merge) {
        //         return {
        //             group_use: r.branch(emp_merge('value_budget').sub(emp_merge('value_use')).le(0),
        //                 false, true)
        //         }
        //     })
        // .eqJoin('academic_id', r.db('welfare_common').table('academic')).without({ right: 'id' }).zip()
        // .eqJoin('active_id', r.db('welfare_common').table('active')).without({ right: 'id' }).zip()
        // .eqJoin('department_id', r.db('welfare_common').table('department')).without({ right: 'id' }).zip()
        // .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).without({ right: 'id' }).zip()
        // .eqJoin('gender_id', r.db('welfare_common').table('gender')).without({ right: 'id' }).zip()
        // .eqJoin('matier_id', r.db('welfare_common').table('matier')).without({ right: 'id' }).zip()
        // .eqJoin('position_id', r.db('welfare_common').table('position')).without({ right: 'id' }).zip()
        // .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).without({ right: 'id' }).zip()
        // .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).without({ right: 'id' }).zip()
        // .without('id')
        // .merge(function (m) {
        //     return {
        //         start_work_date: m('start_work_date'),//.split('T')(0),
        //         birthdate: m('birthdate').toISO8601().split('T')(0)
        //     }
        // })
        .run()
        .then(function (data) {
            res.json(data);
        })

}
exports.cloneData = function (req, res) {
    var newyear = req.body.year;
    var cloneGroupid = req.body.cloneGroupid;
    r.expr(cloneGroupid).forEach(function (fe) {
        return r.db('welfare').table('group_welfare').insert(
            r.db('welfare').table('group_welfare').get(fe('id')).merge({
                year: newyear,
                status_approve: false
            }).without('id')
        )
            .do(function (d) {
                return r.db('welfare').table('welfare').insert(
                    r.db('welfare').table('welfare').getAll(fe('id'), { index: 'group_id' }).merge({
                        group_id: d('generated_keys')(0),
                        status: false
                    }).without('id')
                )
            })
    })
        .then(function (result) {
            res.json(result);
        })
}
exports.updateGroup = function (req, res) {
    var r = req.r
    for (var i = 0; i < req.body.length; i++) {
        req.body[i] = Object.assign(req.body[i],
            {
                condition: req.body[i].condition.map(function (m) {
                    var change_value = {};
                    if (m.logic == ">" || m.logic == "<" || m.logic == ">=" || m.logic == "<=") {
                        change_value = r.ISO8601(m.value).inTimezone('+07');
                    } else {
                        change_value = m.value;
                    }
                    return {
                        field: m.field,
                        field_name: m.field_name,
                        logic: m.logic,
                        logic_show: m.logic_show,
                        value: change_value,
                        value_show: m.value_show
                    }
                })
            }
        );
    }
    var welfare = req.body;
    r.expr(welfare).forEach(function (fe) {
        return r.db('welfare').table('welfare').get(fe('id')).update(fe)
    })
        .then(function (result) {
            res.json(result);
        })
}