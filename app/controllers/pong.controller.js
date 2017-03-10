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
exports.changeValue = function (req, res) {
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
exports.adminWelfare = function (req, res) {
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
exports.groupByYear = function (req, res) {
    var r = req.r;
    year = parseInt(req.params.year);
    r.db('welfare').table('group_welfare')
        .getAll(year, { index: 'year' })
        .pluck('group_welfare_name', 'id')
        .run()
        .then(function (data) {
            res.json(data)
        })
}
exports.adminEmployee = function (req, res) {
    var r = req.r;
    r.db('welfare').table('group_welfare').get(req.params.welId)
        .merge(function (group_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
            }
        })
        .merge(function (group_merge) {
            return {
                welfare: r.db('welfare').table('welfare').getAll(group_merge('id'), { index: 'group_id' }).coerceTo('array')
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
                                .merge({ value_budget: wel_merge('budget'), welfare_id: wel_merge('id'), group_id: group_merge('id'), year: group_merge('year') })
                                .without('count')
                                .distinct()
                        }
                    })
            }
        })
        .merge(function (group_merge) {
            return {
                employee: group_merge('welfare').getField('employee')
            }
        })
        .getField('employee')
        .reduce(function (l, r) {
            return l.add(r)
        })
        .merge(function (emp_merge) {
            return {
                value_use: r.db('welfare').table('history_welfare').getAll(emp_merge('id'), { index: 'emp_id' })
                    .filter({ welfare_id: emp_merge('welfare_id') }).sum('use_budget')
            }
        })
        .eqJoin('academic_id', r.db('welfare_common').table('academic')).without({ right: 'id' }).zip()
        .eqJoin('active_id', r.db('welfare_common').table('active')).without({ right: 'id' }).zip()
        .eqJoin('department_id', r.db('welfare_common').table('department')).without({ right: 'id' }).zip()
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).without({ right: 'id' }).zip()
        .eqJoin('gender_id', r.db('welfare_common').table('gender')).without({ right: 'id' }).zip()
        .eqJoin('matier_id', r.db('welfare_common').table('matier')).without({ right: 'id' }).zip()
        .eqJoin('position_id', r.db('welfare_common').table('position')).without({ right: 'id' }).zip()
        .eqJoin('prefixname_id', r.db('welfare_common').table('prefixname')).without({ right: 'id' }).zip()
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).without({ right: 'id' }).zip()
        .run()
        .then(function (data) {
            res.json(data);
        })

}

exports.condition = function (req, res) {
    var r = req.r;

    r.db('welfare').table('condition')
        .merge(function (con_merge) {
            return {
                data: r.branch(
                    con_merge('data_source').eq(""),
                    "",
                    r.db('welfare_common').table(con_merge('data_source')).merge(function (com_map) {
                        return {
                            id: com_map('id'),
                            name: com_map(con_merge('data_source').add('_name'))
                        }
                    }).coerceTo('array')
                        .merge(function (data_merge) {
                            return {
                                name: r.branch(
                                    con_merge('data_source').eq("department"),
                                    r.db('welfare_common').table('faculty').get(data_merge('faculty_id')).getField('faculty_name').add('/', data_merge('name')),
                                    data_merge('name')
                                )
                            }
                        })
                        .pluck('id', 'name')
                        .orderBy('name')
                )
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}