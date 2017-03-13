exports.list = function (req, res) {
    var r = req.r
    req.params.year = parseInt(req.params.year);
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
                        }
                    })
                    .merge(function (m) {
                        return {
                            value_budget: m('welfare').sum('value_budget'),
                            value_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
                                .filter({ year: req.params.year }).sum('use_budget'),
                            emp_budget: m('welfare').sum('emp_budget'),
                            emp_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
                                .filter({ year: req.params.year }).pluck('emp_id').distinct().count(),
                            time_use: r.db('welfare').table('history_welfare').getAll(m('id'), { index: 'group_id' })
                                .filter({ year: req.params.year }).count()
                        }
                    })
                    .without('welfare')
                    .coerceTo('array')
            }
        })
        .getField('group')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.listId = function (req, res) {
    var r = req.r
    r.db('welfare').table('group_welfare')
        .get(req.params.id)
        .merge(function (m) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
            }
        })
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
                                [m('employees')],
                                wel_merge('condition').map(function (con_map) {
                                    return m('employees').filter(function (f) {
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
                    })
                    .merge(function (m) {
                        return {
                            emp_use: r.db('welfare').table('history_welfare').getAll(m('group_id'), { index: 'group_id' })
                            .pluck('emp_id').distinct().count()
                        }
                    }).without('employee')
                    .coerceTo('array')
            }
        }).without('employees')
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
        req.body = Object.assign(req.body,
            {
                year: req.body.year - 543
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
    // console.log(req.body)
    req.body = Object.assign(req.body,
        {
            year: req.body.year - 543
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
    r.db('welfare').table('group_welfare')
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
    r.db('welfare').table('group_welfare')
        .group('year')
        .ungroup()
        .map(function (y_map) {
            return {
                year: y_map('group').add(543)
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