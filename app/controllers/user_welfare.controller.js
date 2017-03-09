exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).without({ right: 'id' }).zip()
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
                    .eqJoin('prefixname_id', r.db('welfare_common').table('prefixname')).without({ right: 'id' }).zip()
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
        .group('group_id')
        .ungroup()
        .merge(function (m) {
            return {
                group_welfare_name: m('reduction')(0)('group_welfare_name'),
                welfare: m('reduction'),
                group_id: m('group')
            }
        }).without('group', 'reduction')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.listId = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .merge(function (wel_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
                    .eqJoin('academic_id', r.db('welfare_common').table('academic')).without({ right: 'id' }).zip()
                    .eqJoin('active_id', r.db('welfare_common').table('active')).without({ right: 'id' }).zip()
                    .eqJoin('department_id', r.db('welfare_common').table('department')).without({ right: 'id' }).zip()
                    .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).without({ right: 'id' }).zip()
                    .eqJoin('gender_id', r.db('welfare_common').table('gender')).without({ right: 'id' }).zip()
                    .eqJoin('matier_id', r.db('welfare_common').table('matier')).without({ right: 'id' }).zip()
                    .eqJoin('position_id', r.db('welfare_common').table('position')).without({ right: 'id' }).zip()
                    .eqJoin('prefixname_id', r.db('welfare_common').table('prefixname')).without({ right: 'id' }).zip()
                    .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).without({ right: 'id' }).zip()
                    .without('academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'prefixname_id', 'type_employee_id')
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
                    .distinct()
                    .without('count')
            }
        })
        .without('employees', 'employee1', 'employee2', 'employee3', 'countCon')
        .run()
        .then(function (result) {
            res.json([result])
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
