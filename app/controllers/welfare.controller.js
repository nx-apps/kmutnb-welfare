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
                    return {
                        field: m.field,
                        logic: m.logic,
                        logic_show: m.logic_show,
                        value: r.ISO8601(m.value).inTimezone('+07'),
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
                return {
                    field: m.field,
                    logic: m.logic,
                    logic_show: m.logic_show,
                    value: r.ISO8601(m.value).inTimezone('+07'),
                    value_show: m.value_show
                }
            })
        }
    );
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
    r.db('welfare').table('welfare')
        .get(req.params.welfare_id)
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
                start_date: m('start_date').toISO8601().split('T')(0),
                end_date: m('end_date').toISO8601().split('T')(0),
                count_employee: m('employee').count()
            }
        })
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}