exports.list = function (req, res) {
    var r = req.r
    req.params.year = parseInt(req.params.year);
    r.expr({
        employees: r.db('welfare').table('employee').coerceTo('array'),
        group: []
    })
        .merge(function (group_fund) {
            return {
                group: r.db('welfare').table('group_fund')
                    .getAll(req.params.year, { index: 'year' })
                    .merge(function (m) {
                        return {
                            year: m('year').add(543),
                            start_date: m('start_date').split('T')(0),
                            end_date: m('end_date').split('T')(0),
                            fund: r.db('welfare').table('fund').getAll(m('id'), { index: 'group_fund_id' }).coerceTo('array')
                                .merge(function (fund_merge) {
                                    return {
                                        condition: fund_merge('condition')
                                            .merge(function (con_merge) {
                                                return {
                                                    field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
                                                }
                                            })
                                    }
                                })
                                .merge(function (fund_merge) {
                                    return {
                                        countCon: fund_merge('condition').count(),
                                        employee: r.branch(fund_merge('condition').count().eq(0),
                                            [group_fund('employees')],
                                            fund_merge('condition').map(function (con_map) {
                                                return group_fund('employees').filter(function (f) {
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
                                .merge(function (fund_merge) {
                                    return {
                                        employee: fund_merge('employee').reduce(function (l, r) {
                                            return l.add(r)
                                        })
                                    }
                                })
                                .merge(function (fund_merge) {
                                    return {
                                        employee: fund_merge('employee').merge(function (emp2_merge) {
                                            return {
                                                count: fund_merge('employee').filter(function (f) {
                                                    return f('id').eq(emp2_merge('id'))
                                                }).count()
                                            }
                                        })
                                    }
                                })
                                .merge(function (fund_merge) {
                                    return {
                                        employee: fund_merge('employee')
                                            .filter(function (emp_filter) {
                                                return r.branch(fund_merge('countCon').eq(0),
                                                    emp_filter('count').eq(fund_merge('countCon').add(1)),
                                                    emp_filter('count').eq(fund_merge('countCon'))
                                                )
                                            }).coerceTo('array')
                                            .distinct()
                                    }
                                })
                                .merge(function (fund_merge) {
                                    return {
                                        emp_budget: fund_merge('employee').count()
                                    }
                                })
                        }
                    })
                    .merge(function (m) {
                        return {
                            emp_budget: m('fund').sum('emp_budget'),
                            emp_use: r.db('welfare').table('history_fund').getAll(m('id'), { index: 'group_fund_id' }).coerceTo('array')
                                .pluck('emp_id').distinct().count()
                        }
                    })
                    .without('fund')
                    .coerceTo('array')
            }
        })
        .getField('group')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.insert = function (req, res) {
    var r = req.r
    var valid = req.ajv.validate('group_fund', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body,
            {
                year: req.body.year - 543,
                date_create: new Date().toISOString(),
                date_update: new Date().toISOString(),
                status_approve: false
            }
        );
        r.db('welfare').table('group_fund').insert(req.body)
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
    }
    else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.update = function (req, res) {
    var r = req.r;
    req.body = Object.assign(req.body,
        {
            year: req.body.year - 543,
            date_update: new Date().toISOString()
        }
    );
    r.db('welfare').table('group_fund')
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
    r.db('welfare').table('group_fund')
        .get(req.params.id)
        .delete()
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
    r.db('welfare').table('group_fund')
        .group('year')
        .ungroup()
        .map(function (y_map) {
            return {
                year: y_map('group').add(543)
            }
        })
        .orderBy(r.desc('year'))
        .run()
        .then(function (data) {
            res.json(data)
        })
}