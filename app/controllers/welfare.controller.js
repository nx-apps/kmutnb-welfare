exports.welfare = function (req, res) {
    var r = req.r
    r.expr({
        employees: r.db('welfare').table('employee')
            .without('dob', 'emp_no', 'firstname', 'lastname')
            .coerceTo('array'),
        welfare: []
    })
        .merge(function (root_merge) {
            return {
                welfare: r.db('welfare').table('welfare').coerceTo('array')
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
                                [root_merge('employees').pluck('id')],
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
                                    })
                                        .coerceTo('array')
                                        .pluck('id')
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
                            emp_budget: wel_merge('employee')
                                .group('id').count().ungroup()
                                .filter(function (emp_filter) {
                                    return r.branch(wel_merge('countCon').eq(0),
                                        emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                        emp_filter('reduction').eq(wel_merge('countCon'))
                                    )
                                }).count()
                        }
                    })
                    .without('employee')
                    .merge(function (wel_merge) {
                        return {
                            value_budget: wel_merge('emp_budget').mul(wel_merge('budget'))
                        }
                    })
                    .merge(function (m) {
                        return {
                            emp_use: r.db('welfare').table('history_welfare')
                                .getAll(m('id'), { index: 'welfare_id' })
                                .pluck('emp_id').distinct().count()
                        }
                    })
            }
        })
        .without('employees')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.welfareId = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .get(req.params.id)
        // .merge(function (m) {
        //     return {
        //         condition: m('condition').merge(function (con_merge) {
        //             return {
        //                 conditions: r.db('welfare').table('condition').get(con_merge('field'))
        //                     .merge(function (con_merge) {
        //                         return con_merge
        //                     })
        //             }
        //         }).without('data_source', 'field', 'label')
        //         .merge(function(m){
        //             return {
        //                 conditions : m('conditions')('conditions'),
        //                 label : m('conditions')('label'),
        //                 data_source : m('conditions')('data_source'),
        //                 field : m('conditions')('id')
        //             }
        //         })
        //     }
        // })
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.insert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('list_welfare', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body,
            {
                condition: req.body.condition.map(function (m) {
                    var change_value = {};
                    var search = m.field_name.search('date');
                    if (search != -1) {
                        change_value = r.ISO8601(m.value);
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
        r.db('welfare').table('welfare').insert(req.body)
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
    req.body = Object.assign(req.body,
        {
            condition: req.body.condition.map(function (m) {
                var change_value = {};
                var search = m.field_name.search('date');
                if (search != -1) {
                    change_value = r.ISO8601(m.value);
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
    console.log(req.body)
    r.db('welfare').table('welfare').get(req.body.id)
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
    r.db('welfare').table('welfare').get(req.params.id)
        .delete()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listId = function (req, res) {
    var r = req.r
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

    r.expr({
        employees: r.db('welfare').table('employee').filter({ active_name: 'ทำงาน' })
            .without('dob', 'emp_no', 'firstname', 'lastname')
            .coerceTo('array'),
        welfare: []
    })
        .merge(function (welfare) {
            return {
                welfare: r.db('welfare').table('welfare').get(req.params.welfare_id)
                    .merge(function (m) {
                        return r.db('welfare').table('group_welfare').get(m('group_id')).pluck('group_welfare_name', 'start_date', 'end_date')
                    })
                    .merge(function (wel_merge) {
                        return {
                            countCon: wel_merge('condition').count(),
                            employee: r.branch(wel_merge('condition').count().eq(0),
                                [welfare('employees')],
                                wel_merge('condition').map(function (con_map) {
                                    return welfare('employees').filter(function (f) {
                                        return checkLogic(con_map, f)
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
                        }
                    })
                    .merge(function (wel_merge) {
                        return {
                            employee: wel_merge('employee')
                                .group('id').count().ungroup()
                                .filter(function (emp_filter) {
                                    return r.branch(wel_merge('countCon').eq(0),
                                        emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                        emp_filter('reduction').eq(wel_merge('countCon'))
                                    )
                                })
                                .merge(function (emp_merge) {
                                    return r.db('welfare').table('employee').getAll(emp_merge('group'), { index: 'id' }).coerceTo('array')
                                        .without('academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'prefix_id', 'type_employee_id')
                                        .merge(function (name_merge) {
                                            return {
                                                name: name_merge('prefix_name').add(name_merge('firstname')).add(name_merge('lastname'))
                                            }
                                        })
                                        .without('prefix_name', 'firstname', 'lastname')
                                })
                        }
                    })
                    .without('countCon')
                    .merge(function (m) {
                        return {
                            start_date: m('start_date').toISO8601().split('T')(0),
                            end_date: m('end_date').toISO8601().split('T')(0),
                            count_employee: m('employee').count()
                        }
                    })
            }
        })
        .without('employees')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.active = function (req, res) {
    var r = req.r
    // console.log(111111111111111111111111);
    var group_welfare = function () {
        return r.db('welfare').table('group_welfare')
            .filter({ status_approve: true })
            .filter(function (f) {
                return r.branch(f('type_continuous').eq(true),
                    r.now().inTimezone('+07').ge(f('start_date')),
                    r.now().inTimezone('+07').during(f('start_date').date(), f('end_date').date(), { rightBound: 'closed' })
                )
            })
            .coerceTo('array')
    }
    group_welfare()
    .pluck("id","group_welfare_name","group_use")
        .run()
        .then(function (result) {
            console.log(111);
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}