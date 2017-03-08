exports.welfares = function (req, res) {
    var r = req.r;
    r.db('welfare').table('welfare')
        .merge(function (wel_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
            }
        })
        .merge(function (wel_merge) {
            return {
                countCon: wel_merge('condition').count(),
                employee1: wel_merge('condition').map(function (con_map) {
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
                                            r.branch(con_map('logic').eq("="),
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
                    .filter({ count: wel_merge('countCon') })
                    .coerceTo('array')
                    .distinct()
                    .without('count')
            }
        })
        .without('employees', 'employee1', 'employee2', 'employee3', 'countCon')
        .run()
        .then(function (data) {
            res.json(data);
        })
}
exports.welById = function (req, res) {
    var r = req.r;
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .merge(function (wel_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
            }
        })
        .merge(function (wel_merge) {
            return {
                countCon: wel_merge('condition').count(),
                employee1: wel_merge('condition').map(function (con_map) {
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
                                            r.branch(con_map('logic').eq("="),
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
                    .filter({ count: wel_merge('countCon') })
                    .coerceTo('array')
                    .distinct()
                    .without('count')
            }
        })
        .without('employees', 'employee1', 'employee2', 'employee3', 'countCon')
        .run()
        .then(function (data) {
            res.json(data);
        })
}

exports.employees = function (req, res) {
    var r = req.r;
    r.db('welfare').table('employee')
        .merge(function (emp_merge) {
            return {
                welfare: r.db('welfare').table('welfare')
                    .merge(function (wel_merge) {
                        return {
                            conCount: wel_merge('condition').count(),
                            conPass: wel_merge('condition').map(function (con_map) {
                                return {
                                    pass: emp_merge(con_map('field')).do(function (d) {
                                        return r.branch(con_map('logic').eq(">="),
                                            d.ge(con_map('value')),
                                            r.branch(con_map('logic').eq(">"),
                                                d.gt(con_map('value')),
                                                r.branch(con_map('logic').eq("<="),
                                                    d.le(con_map('value')),
                                                    r.branch(con_map('logic').eq("<"),
                                                        d.lt(con_map('value')),
                                                        r.branch(con_map('logic').eq("="),
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
                    .merge(function (wel_merge) {
                        return {
                            conCountPass: wel_merge('conPass').filter({ pass: true }).count()
                        }
                    })
                    .merge(function (wel_merge) {
                        return {
                            conStatus: wel_merge('conCountPass').eq(wel_merge('conCount'))
                        }
                    })
                    .filter(function (f) {
                        return f('conStatus').eq(true)
                    })
                    //.without('conCount', 'conCountPass', 'conPass', 'conStatus')
                    .pluck('name')
                    .coerceTo('array')
            }
        })
        .without('id')
        .orderBy('name')
        .run()
        .then(function (data) {
            res.json(data);
        })
}

exports.test = function (req, res) {
    var r = req.r;
    r.db('welfare').table('welfare').filter(function (f) {
        return f('condition').contains(function (ff) {
            return ff('value').eq('563da7685e034a0fd60f3781289388e2c7dfdfa1')
        })
    })
        .merge(function (m) {
            return {
                condition1: m('condition').filter(function (f) {
                    return f('value').eq('563da7685e034a0fd60f3781289388e2c7dfdfa1')
                })
            }
        })
        .merge(function (m) {
            return {
                condition2: m('condition1').merge(function (mm) {
                    return {
                        value: 'aaa',
                        value_show: 'aaa'
                    }
                })
            }
        })
        .merge(function (m) {
            return {
                condition3: m('condition').filter(function (f) {
                    return f('value').eq('563da7685e034a0fd60f3781289388e2c7dfdfa1').not()
                })
            }
        })
        .merge(function (m) {
            return {
                condition4: m('condition3').union(m('condition2'))
            }
        })
        .run()
        .then(function (data) {
            res.json(data)
        })
}