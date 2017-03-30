exports.list = function (req, res) {
    // https://localhost:3000/api/employee/list
    // console.log('1111111')
    //  res.json({user:'1'});
    //   var crypto = require('crypto');
    //   var sha1 = crypto.createHash('sha1').update('Apple').digest("hex");
    //   console.log('>>>>>>>',sha1);
    var r = req.r;
    r.db('welfare').table('employee')
        // .merge(function (f) {
        //     return {
        //         start_work_date: f('start_work_date').split('T')(0),
        //         birthdate: f('birthdate').split('T')(0)
        //     }
        // })
        .merge(function (f) {
            return {
                start_work_date: f('start_work_date').split('T')(0),
                birthdate: f('birthdate').split('T')(0),
                academic_name: r.db('welfare_common').table('academic').get(f('academic_id')).getField('academic_name'),
                active_name: r.db('welfare_common').table('active').get(f('active_id')).getField('active_name'),
                department_name: r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
                faculty_name: r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
                gender_name: r.db('welfare_common').table('gender').get(f('gender_id')).getField('gender_name'),
                matier_name: r.db('welfare_common').table('matier').get(f('matier_id')).getField('matier_name'),
                position_name: r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
                prefix_name: r.db('welfare_common').table('prefix').get(f('prefix_id')).getField('prefix_name'),
                type_employee_name: r.db('welfare_common').table('type_employee').get(f('type_employee_id')).getField('type_employee_name'),
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
exports.insert = function (req, res) {
    var r = req.r;
    var result = { result: false, message: null, id: null };
    r.db('welfare').table('employee').insert(req.body)
        .run()
        .then((response) => {
            result.message = response;
            if (response.errors == 0) {
                result.result = true;
                result.id = response.generated_keys;
            }
            res.json(result);
        })
        .error(function (err) {
            result.message = err;
            res.json(result);
        })
}
exports.delete = function (req, res) {
    console.log(req.body)
    var r = req.r;
    r.db('welfare').table('employee')
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
exports.update = function (req, res) {
    var r = req.r;
    // console.log(req.body)
    // req.body = Object.assign(req.body, { year: req.body.year - 543 });
    for (let prop in req.body) {
        req.body[prop] = req.body[prop].replace(/ /g, '').trim()
    }
    r.db('welfare').table('employee')
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
exports.welfaresYear = function (req, res) {
    var r = req.r;
    //แก้ด้วย
    let year = Number(req.params.year)
    let now_Date = { now_date: + new Date() }
    // https://localhost:3000/api/employee/welfares/year/2017/id/411e54dd-b808-4d4d-9984-201b68c70dff
    r.db('welfare').table('employee').get(req.params.id)
        .merge(function (emp) {
            return {
                gender: r.db('welfare_common').table('gender').get(emp('gender_id')).getField('gender_name')
            }
        }
        )
        .merge(function (f) {
            return {
                start_work_date: f('start_work_date').split('T')(0),
                birthdate: f('birthdate').split('T')(0),
                academic_name: r.db('welfare_common').table('academic').get(f('academic_id')).getField('academic_name'),
                active_name: r.db('welfare_common').table('active').get(f('active_id')).getField('active_name'),
                department_name: r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
                faculty_name: r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
                gender_name: r.db('welfare_common').table('gender').get(f('gender_id')).getField('gender_name'),
                matier_name: r.db('welfare_common').table('matier').get(f('matier_id')).getField('matier_name'),
                position_name: r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
                prefix_name: r.db('welfare_common').table('prefix').get(f('prefix_id')).getField('prefix_name'),
                type_employee_name: r.db('welfare_common').table('type_employee').get(f('type_employee_id')).getField('type_employee_name'),
            }
        })
        .merge((group_welfare) => {
            return {
                rvd_status: r.branch(group_welfare('type_employee_name').eq('พนักงานมหาวิทยาลัย'), true, false),
                group_welfare: r.db('welfare').table('group_welfare').getAll(year, { index: 'year' })
                    .filter({ status_approve: true })
                    .merge((welfare_conditions) => {
                        return {
                            conditions: r.db('welfare').table('welfare').getAll(welfare_conditions('id'), { index: 'group_id' })
                                .merge((mer_id) => {
                                    return {
                                        welfare_id: mer_id('id'),
                                        year: welfare_conditions('year'),
                                        admin_use: welfare_conditions('admin_use'),
                                        onetime: welfare_conditions('onetime'),
                                        group_welfare_name: welfare_conditions('group_welfare_name'),
                                        start_date: r.ISO8601(welfare_conditions('start_date')).toEpochTime(),
                                        end_date: r.ISO8601(welfare_conditions('end_date')).toEpochTime(),
                                        now_date: r.now().toEpochTime()
                                    }
                                })
                                .without('id')
                                .coerceTo('array')
                        }
                    })
                    .coerceTo('array')
            }
        })
        .merge((welfare) => {
            return {
                welfare: welfare('group_welfare').getField('conditions').count()
                    .eq(0)
                    .branch([], welfare('group_welfare').getField('conditions')
                        // remove array 1 dimintion
                        .reduce(function (left, right) {
                            return left.add(right);
                        })
                        .merge((conditions) => {
                            return {
                                condition: conditions('condition').merge((changeName) => {
                                    return {
                                        field: r.db('welfare').table('condition').get(changeName('field')).getField('field')
                                    }
                                })
                            }
                        })
                        .merge(function (we_m) {
                            return {
                                count: we_m('condition').count(),
                                countpass: we_m('condition').map(function (con_map) {
                                    return {
                                        pass: welfare(con_map('field')).do(function (d) {
                                            return r.branch(con_map('logic').eq(">="),
                                                d.ge(con_map('value')),
                                                r.branch(con_map('logic').eq(">"),
                                                    d.gt(con_map('value')),
                                                    r.branch(con_map('logic').eq("<="),
                                                        d.le(con_map('value')),
                                                        r.branch(con_map('logic').eq("<"),
                                                            d.lt(con_map('value')),
                                                            r.branch(con_map('logic').eq("=="),
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
                        .merge((e) => {
                            return {
                                countpass_total: e('countpass').filter({ "pass": true }).count()
                            }
                        })
                        .merge((status) => {
                            return {
                                count_pass_status: status('countpass_total').eq(status('count')),
                                id: welfare('id')
                            }
                        })
                        .filter({ "count_pass_status": true })
                        .merge((use_his) => {
                            return {
                                budget_use: r.db('welfare').table('history_welfare')
                                    .getAll(welfare('id'), { index: 'emp_id' })
                                    .filter(
                                    {
                                        status: 'approve',
                                        //  emp_id: welfare('id'),
                                        welfare_id: use_his('welfare_id')
                                    }
                                    )
                                    .sum('use_budget'),
                            }
                        })
                        .merge((balance) => {
                            return {
                                budget_balance: balance('budget').sub(balance('budget_use')),
                                budget_balance_check: balance('budget').sub(balance('budget_use')).le(0).branch(true, false)
                            }
                        })
                        .merge((check_onetime) => {
                            return {
                                check_onetime_thai: check_onetime('onetime').branch('ใช้ได้ครั้งเดียว','ใช้ได้หลายครั้ง')
                            }
                        })
                        // เอาสวัสดิการที่ยังมีเงินเหลือออกมาแสดง
                        .filter({ "budget_balance_check": false })
                        .without('condition', 'countpass')
                    )
            }
        })

        .merge((use_his) => {
            return {

                history_welfare: r.db('welfare').table('history_welfare')
                    // .filter({ emp_id: use_his('id'), year: year })
                    .getAll(use_his('id'), { index: 'emp_id' })
                    .filter({ year: year })
                    .merge((name_welfare) => {
                        return {
                            date_use: name_welfare('date_use').split('T')(0),
                            date_approve: name_welfare.hasFields('date_approve').branch(name_welfare('date_approve').split('T')(0), false),//,
                            name: r.db('welfare').table('group_welfare').get(r.db('welfare').table('welfare').get(name_welfare('welfare_id')).getField('group_id')).getField('group_welfare_name'),
                            history_welfare_id: name_welfare('id'),
                            onetime: r.db('welfare').table('group_welfare').get(r.db('welfare').table('welfare').get(name_welfare('welfare_id')).getField('group_id')).getField('onetime'),
                        }
                    })
                    .merge((files)=>{
                        return {
                            file:files('document_ids').map((doc_id)=>{
                                return r.db('welfare').table('files').get(r.db('welfare').table('document_file').get(doc_id).getField('file_id'))
                                .without('contents')
                            })
                        }
                    })
                    .merge((check_onetime) => {
                            return {
                                check_onetime_thai: check_onetime('onetime').branch('ใช้ได้ครั้งเดียว','ใช้ได้หลายครั้ง')
                            }
                        })
                    .without('id')
                    .orderBy('date_use')
                    .coerceTo('array')
            }
        })
        .merge((checkTrue) => {
            return {
                welfare: checkTrue('welfare').merge((e) => {
                    return {
                        status_approve: checkTrue('history_welfare').filter({ status: 'request', welfare_id: e('welfare_id') }).count().gt(0),//e('welfare_id'),
                        welfare_old: e('start_date').ge(e('now_date')).branch(true,
                            e('end_date').ge(e('now_date')).branch(false, true))
                    }
                })
                // 
            }
        })
        // .merge((withOutHistorty) => {
        //     return {
        //         history_welfare: withOutHistorty('history_welfare').filter({ status: true })
        //     }
        // })
        .without('group_welfare')

        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}

exports.welfaresEmployee = function (req, res) {
    var r = req.r;
    //แก้ด้วย
    // let year = Number(req.params.year)
    // https://localhost:3000/api/employee/welfares/id/875932f9-a308-4802-980e-247f82f4fb1c
    r.db('welfare').table('employee').get(req.params.id)
        .merge(function (emp) {
            return {
                gender: r.db('welfare_common').table('gender').get(emp('gender_id')).getField('gender_name')
            }
        }
        )
        .merge(function (f) {
            return {
                start_work_date: f('start_work_date').split('T')(0),
                birthdate: f('birthdate').split('T')(0),
                academic_name: r.db('welfare_common').table('academic').get(f('academic_id')).getField('academic_name'),
                active_name: r.db('welfare_common').table('active').get(f('active_id')).getField('active_name'),
                department_name: r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
                faculty_name: r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
                gender_name: r.db('welfare_common').table('gender').get(f('gender_id')).getField('gender_name'),
                matier_name: r.db('welfare_common').table('matier').get(f('matier_id')).getField('matier_name'),
                position_name: r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
                prefix_name: r.db('welfare_common').table('prefix').get(f('prefix_id')).getField('prefix_name'),
                type_employee_name: r.db('welfare_common').table('type_employee').get(f('type_employee_id')).getField('type_employee_name'),
            }
        })
        .merge((group_welfare) => {
            return {
                group_welfare: r.db('welfare').table('group_welfare')
                    // .getAll(year, { index: 'year' })
                    .merge((welfare_conditions) => {
                        return {
                            conditions: r.db('welfare').table('welfare').getAll(welfare_conditions('id'), { index: 'group_id' })
                                .merge((mer_id) => {
                                    return {
                                        welfare_id: mer_id('id'),
                                        year: welfare_conditions('year'),
                                        admin_use: welfare_conditions('admin_use'),
                                        onetime: welfare_conditions('onetime'),
                                        group_welfare_name: welfare_conditions('group_welfare_name')
                                    }
                                })
                                .without('id')
                                .coerceTo('array')
                        }
                    })
                    .coerceTo('array')
            }
        })
        .merge((welfare) => {
            return {
                welfare: welfare('group_welfare').getField('conditions')
                    .reduce(function (left, right) {
                        return left.add(right);
                    })
                    .merge((conditions) => {
                        return {
                            condition: conditions('condition').merge((changeName) => {
                                return {
                                    field: r.db('welfare').table('condition').get(changeName('field')).getField('field')
                                }
                            })
                        }
                    })
                    .merge(function (we_m) {
                        return {
                            count: we_m('condition').count(),
                            countpass: we_m('condition').map(function (con_map) {
                                return {
                                    pass: welfare(con_map('field')).do(function (d) {
                                        return r.branch(con_map('logic').eq(">="),
                                            d.ge(con_map('value')),
                                            r.branch(con_map('logic').eq(">"),
                                                d.gt(con_map('value')),
                                                r.branch(con_map('logic').eq("<="),
                                                    d.le(con_map('value')),
                                                    r.branch(con_map('logic').eq("<"),
                                                        d.lt(con_map('value')),
                                                        r.branch(con_map('logic').eq("=="),
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
                    .merge((e) => {
                        return {
                            countpass_total: e('countpass').filter({ "pass": true }).count()
                        }
                    })
                    .merge((status) => {
                        return {
                            count_pass_status: status('countpass_total').eq(status('count')),
                            id: welfare('id')
                        }
                    })
                    .filter({ "count_pass_status": true })
                    .merge((use_his) => {
                        return {
                            budget_use: r.db('welfare').table('history_welfare')
                                .getAll(welfare('id'), { index: 'emp_id' })
                                .filter(
                                {
                                    status: true,
                                    //  emp_id: welfare('id'),
                                    welfare_id: use_his('welfare_id')
                                }
                                )
                                .sum('use_budget'),
                        }
                    })
                    .merge((balance) => {
                        return {
                            budget_balance: balance('budget').sub(balance('budget_use')),
                            budget_balance_check: balance('budget').sub(balance('budget_use')).le(0).branch(true, false)
                        }
                    })

                    // เอาสวัสดิการที่ยังมีเงินเหลือออกมาแสดง
                    .filter({ "budget_balance_check": false })
                    .without('condition', 'countpass')

            }
        })

        .merge((use_his) => {
            return {

                history_welfare: r.db('welfare').table('history_welfare')
                    // .filter({ emp_id: use_his('id'), year: year })
                    .getAll(use_his('id'), { index: 'emp_id' })
                    // .filter({ year: year })
                    .merge((name_welfare) => {
                        return {
                            date_use: name_welfare('date_use').split('T')(0),
                            // date_approve: name_welfare('date_approve').split('T')(0),
                            name: r.db('welfare').table('group_welfare').get(r.db('welfare').table('welfare').get(name_welfare('welfare_id')).getField('group_id')).getField('group_welfare_name'),
                            history_welfare_id: name_welfare('id')
                        }
                    })
                    .without('id')
                    .orderBy('date_use')
                    .coerceTo('array')
            }
        })
        .merge((checkTrue) => {
            return {
                welfare: checkTrue('welfare').merge((e) => {
                    return {
                        status_approve: checkTrue('history_welfare').filter({ status: false, welfare_id: e('welfare_id') }).count().gt(0)//e('welfare_id')
                    }
                })
            }
        })
        .merge((withOutHistorty) => {
            return {
                history_welfare: withOutHistorty('history_welfare').filter({ status: true })
            }
        })
        .without('group_welfare')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}