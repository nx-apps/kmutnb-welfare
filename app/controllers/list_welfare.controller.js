exports.listWelfare = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .merge(function (wel_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
            }
        })
        .merge(function (wel_merge) {
            return {
                countCon: wel_merge('condition').count(),
                employee: r.branch(wel_merge('condition').count().eq(0),
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
                emp_use: r.db('welfare').table('history_welfare')
                    .getAll(m('id'), { index: 'welfare_id' })
                    .pluck('emp_id').distinct().count()
            }
        }).coerceTo('array')
        .without('employees', 'employee')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.listWelfareId = function (req, res) {
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
        console.log(req.body);
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
    // console.log(req.body)
    r.db('welfare').table('welfare')
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
    r.db('welfare').table('welfare')
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