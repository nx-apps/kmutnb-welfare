exports.day = (req, res) => {
    //  ดูเงินที่ใช้รายวัน อย่างเดียว
    let group_id = req.query.group_id
    let year = Number(req.query.year || new Date().getFullYear())
    // console.log(group_id, year);
    // r.db('welfare').table('history_welfare').filter(function (row) {
    //     return row('date_use').split('T')(0).eq(req.query.date_start)
    // }).filter({ status: 'approve', group_id: group_id })
    // .orderBy(r.asc('date_use'))
    // .merge((date) => {
    //     return {
    //         date_approve: date('date_approve').split('T')(0),
    //         date_use: date('date_use').split('T')(0)
    //     }
    // })
    // .group('date_approve')
    // .ungroup()
    // .merge((total) => {
    //     return {
    //         id: total('group'),
    //         bath: total('reduction').sum('use_budget')
    //     }
    // })
    // .without('reduction', 'group')
    let date = [];
    date.push({
        id: req.query.date_start
    })
    const r = req.r
    r.expr({
        date: date,
        emp: r.db('welfare').table('group_welfare').getAll(year, { index: 'year' })
            .filter({ status_approve: true, id: group_id })
            .merge((get_con) => {
                return {
                    conditions: r.db('welfare').table('welfare').getAll(get_con('id'), { index: 'group_id' })
                        .merge(function (wel_merge) {
                            return {
                                condition: wel_merge('condition')
                                    .merge(function (con_merge) {
                                        return {
                                            field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
                                        }
                                    }),
                                employees: r.db('welfare').table('employee')
                                    .eqJoin('active_id', r.db('welfare_common').table('active'))
                                    .pluck('left', { right: ['active_code'] })
                                    .zip()
                                    .filter({ active_code: 'WORK' })
                                    .coerceTo('array')
                            }
                        })
                        .coerceTo('array'),
                }
            })
            .coerceTo('array')
    })
        // ย้ายพนักงงานและพนักงานใส่วัน
        .merge((move_emp) => {
            return {
                date: move_emp('date').merge((emp) => {
                    return {
                        welfare: move_emp('emp')
                    }
                })
            }
        })
        .getField('date')
        .merge((setDate) => {
            return {
                id: setDate('id'),
                date_start: setDate('id').add('T00:00:00:000Z'),
                date_end: setDate('id').add('T23:59:59:999Z')
            }
        })
        .merge((getDate) => {
            return {
                bath: r.db('welfare').table('history_welfare').between(getDate('date_start'), getDate('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: group_id })
                    .orderBy(r.asc('date_use'))
                    .sum('use_budget'),
                emp_use: r.db('welfare').table('history_welfare').between(getDate('date_start'), getDate('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: group_id })
                    .count(),
                employees: getDate('welfare').merge((el) => {
                    return {
                        conditions: el('conditions').merge(function (wel_merge) {
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
                            //นับคนที่ผ่าน
                            .merge((count) => {
                                return {
                                    emp_count: count('employee').count()
                                }
                            })
                        // ss: el('conditions').
                    }
                })
                    .merge((count_2) => {
                        return {
                            count_emp: count_2('conditions').sum('emp_count')
                        }
                    })
            }
        })
        .merge((count_3) => {
            return {
                emp_pass: count_3('employees').sum('count_emp')
            }
        })
        .without('date_start', 'date_end', 'employees', 'welfare')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.week = (req, res) => {
    //  ดูเงินที่ใช้รายอาทิตย์ อย่างเดียว
    let result = 1;
    let date_start = +new Date(req.query.date_start);
    let date_end = +new Date(req.query.date_end);
    let day = 1000 * 60 * 60 * 24;
    // ได้จำนวนวันที่ห่างมา
    let conuntDay = ((date_end - date_start) / day);
    let date = [];
    let tomorrow = new Date(date_start)
    let year = req.query.year || new Date().getFullYear()
    for (var i = 0; i < conuntDay; i++) {
        if (i == 0) {
            date.push({ id: new Date(tomorrow.setDate(tomorrow.getDate() + 0)).toISOString().split('T')[0] })
        }
        date.push({ id: new Date(tomorrow.setDate(tomorrow.getDate() + 1)).toISOString().split('T')[0] })
    }
    let group_id = req.query.group_id
    // console.log(group_id);
    const r = req.r
    r.expr({
        date: date,
        emp: r.db('welfare').table('group_welfare').getAll(year, { index: 'year' })
            .filter({ status_approve: true, id: group_id })
            .merge((get_con) => {
                return {
                    conditions: r.db('welfare').table('welfare').getAll(get_con('id'), { index: 'group_id' })
                        .merge(function (wel_merge) {
                            return {
                                condition: wel_merge('condition')
                                    .merge(function (con_merge) {
                                        return {
                                            field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
                                        }
                                    }),
                                employees: r.db('welfare').table('employee')
                                    .eqJoin('active_id', r.db('welfare_common').table('active'))
                                    .pluck('left', { right: ['active_code'] })
                                    .zip()
                                    .filter({ active_code: 'WORK' })
                                    .coerceTo('array')
                            }
                        })
                        .coerceTo('array'),
                }
            })
            .coerceTo('array')
    })
        //ย้ายพนักงงานและพนักงานใส่วัน
        .merge((move_emp) => {
            return {
                date: move_emp('date').merge((emp) => {
                    return {
                        welfare: move_emp('emp')
                    }
                })
            }
        })
        .getField('date')
        .merge((setDate) => {
            return {
                id: setDate('id'),
                date_start: setDate('id').add('T00:00:00:000Z'),
                date_end: setDate('id').add('T23:59:59:999Z')
            }
        })
        .merge((getDate) => {
            return {
                bath: r.db('welfare').table('history_welfare').between(getDate('date_start'), getDate('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: group_id })
                    .orderBy(r.asc('date_use'))
                    .sum('use_budget'),
                emp_use: r.db('welfare').table('history_welfare').between(getDate('date_start'), getDate('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: group_id })
                    .count(),
                employees: getDate('welfare').merge((el) => {
                    return {
                        conditions: el('conditions').merge(function (wel_merge) {
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
                            //นับคนที่ผ่าน
                            .merge((count) => {
                                return {
                                    emp_count: count('employee').count()
                                }
                            })
                        // ss: el('conditions').
                    }
                })
                    .merge((count_2) => {
                        return {
                            count_emp: count_2('conditions').sum('emp_count')
                        }
                    })
            }
        })
        .merge((count_3) => {
            return {
                emp_pass: count_3('employees').sum('count_emp')
            }
        })
        .without('date_start', 'date_end', 'employees', 'welfare')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.month = (req, res) => {
    let result = 1
    req.query.year = Number(req.query.year)
    let year = req.query.year;//2017
    let month = req.query.month;//03
    let date_start = year + "-" + month + "-01T00:00:00:000Z"
    let date_end = year + "-" + month + "-" + new Date(year, month, 0).getDate() + 'T23:59:59:999Z'
    // console.log(date_start, date_end);
    const r = req.r
    r.db('welfare').table('group_welfare').getAll(req.query.year, { index: 'year' })
        .filter({ status_approve: true })
        .merge((get_con) => {
            return {
                conditions: r.db('welfare').table('welfare').getAll(get_con('id'), { index: 'group_id' })
                    .merge(function (wel_merge) {
                        return {
                            condition: wel_merge('condition')
                                .merge(function (con_merge) {
                                    return {
                                        field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
                                    }
                                }),
                            employees: r.db('welfare').table('employee')
                                .eqJoin('active_id', r.db('welfare_common').table('active'))
                                .pluck('left', { right: ['active_code'] })
                                .zip()
                                .filter({ active_code: 'WORK' })
                                .coerceTo('array')
                        }
                    })
                    .coerceTo('array'),
            }
        })
        .merge((getDate) => {
            return {
                bath: r.db('welfare').table('history_welfare')
                    .between(date_start, date_end, { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: getDate('id') })
                    .orderBy(r.asc('date_use'))
                    .sum('use_budget'),
                emp_use: r.db('welfare').table('history_welfare').between(date_start, date_end, { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: getDate('id') })
                    .count(),
                employees: getDate('conditions').merge((el) => {
                    return {
                        countCon: el('condition').count(),
                        employee: r.branch(el('condition').count().eq(0),
                            [el('employees')],
                            el('condition').map(function (con_map) {
                                return el('employees').filter(function (f) {
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
                    //นับคนที่ผ่าน
                    .merge((count) => {
                        return {
                            emp_count: count('employee').count()
                        }
                    })

            }
        })
        .merge((count_2) => {
            return {
                emp_pass: count_2('employees').sum('emp_count')
            }
        })
        .merge((name) => {
            return {
                id: name('group_welfare_name')
            }
        })
        .without('group_welfare_name', 'year', 'description', 'group_use', 'end_date', 'onetime', 'start_date', 'status_approve','employees','conditions')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.year = (req, res) => {
    //  ดูเงินที่ใช้รายเดือน อย่างเดียว
    req.query.year = Number(req.query.year)
    let year = req.query.year;//2017
    let date = []
    for (var i = 1; i <= 12; i++) {
        if (i < 10)
            i = '0' + i

        date.push({
            id: String(i),
            date_start: year + "-" + i + "-" + '01' + 'T00:00:0:000Z',
            date_end: year + "-" + i + "-" + new Date(2017, i, 0).getDate() + 'T23:59:59:999Z',
        })
    }
    let result = 1
    let group_id = req.query.group_id
    const r = req.r
    r.expr({
        date: date,
        emp: r.db('welfare').table('group_welfare').getAll(year, { index: 'year' })
            .filter({ status_approve: true, id: group_id })
            .merge((get_con) => {
                return {
                    conditions: r.db('welfare').table('welfare').getAll(get_con('id'), { index: 'group_id' })
                        .merge(function (wel_merge) {
                            return {
                                condition: wel_merge('condition')
                                    .merge(function (con_merge) {
                                        return {
                                            field: r.db('welfare').table('condition').get(con_merge('field')).getField('field')
                                        }
                                    }),
                                employees: r.db('welfare').table('employee')
                                    .eqJoin('active_id', r.db('welfare_common').table('active'))
                                    .pluck('left', { right: ['active_code'] })
                                    .zip()
                                    .filter({ active_code: 'WORK' })
                                    .coerceTo('array')
                            }
                        })
                        .coerceTo('array'),
                }
            })
            .coerceTo('array')
    })
        //ย้ายพนักงงานและพนักงานใส่วัน
        .merge((move_emp) => {
            return {
                date: move_emp('date').merge((emp) => {
                    return {
                        welfare: move_emp('emp')
                    }
                })
            }
        })
        .getField('date')
        .merge((getDate) => {
            return {
                bath: r.db('welfare').table('history_welfare')
                    .between(getDate('date_start'), getDate('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({
                        status: 'approve',
                        group_id: group_id
                    })
                    .orderBy(r.asc('date_use'))
                    .sum('use_budget'),
                emp_use: r.db('welfare').table('history_welfare').between(getDate('date_start'), getDate('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: group_id })
                    .count(),
                employees: getDate('welfare').merge((el) => {
                    return {
                        conditions: el('conditions').merge(function (wel_merge) {
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
                            //นับคนที่ผ่าน
                            .merge((count) => {
                                return {
                                    emp_count: count('employee').count()
                                }
                            })
                        // ss: el('conditions').
                    }
                })
                    .merge((count_2) => {
                        return {
                            count_emp: count_2('conditions').sum('emp_count')
                        }
                    })
            }
        })
        .merge((count_3) => {
            return {
                emp_pass: count_3('employees').sum('count_emp')
            }
        })
        .without('date_start', 'date_end', 'employees', 'welfare')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}