exports.list = function (req, res) {
    // https://localhost:3000/api/employee/list
    // console.log('1111111')
    //  res.json({user:'1'});
    var r = req.r;
    // r.db('welfare').table('employee').limit(10)
    //     .merge(function (f) {
    //         return {
    //             start_work_date: f('start_work_date').split('T')(0),
    //             birthdate: f('birthdate').split('T')(0),
    //         }
    //     })
    //     .eqJoin('academic_id', r.db('welfare_common').table('academic')).pluck('left', { right: ['academic_name'] }).zip()
    //     .eqJoin('active_id', r.db('welfare_common').table('active')).pluck('left', { right: ['active_name'] }).zip()
    //     .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: ['department_name'] }).zip()
    //     .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: ['faculty_name'] }).zip()
    //     .eqJoin('gender_id', r.db('welfare_common').table('gender')).pluck('left', { right: ['gender_name'] }).zip()
    //     .eqJoin('matier_id', r.db('welfare_common').table('matier')).pluck('left', { right: ['matier_name'] }).zip()
    //     .eqJoin('position_id', r.db('welfare_common').table('position')).pluck('left', { right: ['position_name'] }).zip()
    //     .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck('left', { right: ['prefix_name'] }).zip()
    //     .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck('left', { right: ['type_employee_name'] }).zip()
    //     .without('academic_id','active_id','department_id','faculty_id','gender_id','matier_id','position_id','type_employee_id','prefix_id')
    r.expr({
        academic: r.db('welfare_common').table('academic').coerceTo('Array'),
        active: r.db('welfare_common').table('active').coerceTo('Array'),
        // department: r.db('welfare_common').table('department').coerceTo('Array'),
        // faculty: r.db('welfare_common').table('faculty').coerceTo('Array'),
        // gender: r.db('welfare_common').table('gender').coerceTo('Array'),
        // matier: r.db('welfare_common').table('matier').coerceTo('Array'),
        position: r.db('welfare_common').table('position').coerceTo('Array'),
        // prefix: r.db('welfare_common').table('prefix').coerceTo('Array'),
        // type_employee: r.db('welfare_common').table('type_employee').coerceTo('Array'),
    })
        .merge((emp) => {
            return {
                emp: r.db('welfare').table('employee').coerceTo('Array')//.limit(1)
                    .merge((merName) => {
                        return {
                            academic_name: emp('academic').filter({ id: merName('academic_id') }).reduce((left, right) => {
                                return left.add(right);
                            }).default('-').pluck('academic_name').getField('academic_name'),
                            active_name: emp('active').filter({ id: merName('active_id') }).reduce((left, right) => {
                                return left.add(right);
                            }).default('-').pluck('active_name').getField('active_name'),
                            // department_name: emp('department').filter({ id: merName('department_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('department_name').getField('department_name'),
                            // faculty_name: emp('faculty').filter({ id: merName('faculty_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('faculty_name').getField('faculty_name'),
                            // gender_name: emp('gender').filter({ id: merName('gender_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('gender_name').getField('gender_name'),
                            // matier_name: emp('matier').filter({ id: merName('matier_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('matier_name').getField('matier_name'),
                            position_name: emp('position').filter({ id: merName('position_id') }).reduce((left, right) => {
                                return left.add(right);
                            }).default('-').pluck('position_name').getField('position_name'),
                            // prefix_name: emp('prefix').filter({ id: merName('prefix_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('prefix_name').getField('prefix_name'),
                            // type_employee_name: emp('type_employee').filter({ id: merName('type_employee_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('type_employee_name').getField('type_employee_name'),
                        }
                    })
            }
        })
        .getField('emp')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.searchPid = function (req, res) {
    var r = req.r;
    let personal_id = req.params.pid
    r.db('welfare').table('employee').getAll(personal_id, { index: 'personal_id' })
        .filter(function (row) {
            return row("active_name").ne("ทำงาน");
        })
        .orderBy(r.desc('date_update'))
        .run()
        .then((response) => {
            let newData = []
            if (response.length > 0) {
                newData.push(response[0])
            }
            res.json(newData);
        })
        .error((err) => {
            result.message = err;
            res.json(result);
        })

}
exports.insert = function (req, res) {
    var r = req.r;
    var result = { result: false, message: null, id: null };
    req.body.start_work_date = r.ISO8601(req.body.start_work_date).inTimezone('+07:00')
    req.body.birthdate = r.ISO8601(req.body.birthdate).inTimezone('+07:00')
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
    // for (let prop in req.body) {
    //     req.body[prop] = req.body[prop].replace(/ /g, '').trim()

    // }
    function getAge(end_work_date, birthday) {
        var end_work_date = new Date(end_work_date)
        var birthDate = new Date(birthday)
        // console.log(end_work_date, birthDate);
        var age = end_work_date.getFullYear() - birthDate.getFullYear();
        var m = end_work_date.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && end_work_date.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    // 2017-06-01T00:00:00.000+07:00
    let start_work_date = req.body.start_work_date,
        end_work_date = req.body.end_work_date,
        birthdate = req.body.birthdate
    if (end_work_date !== null && end_work_date !== undefined && end_work_date !== '') {


        req.body.age = getAge(end_work_date.split('T')[0], birthdate.split('T')[0])
        req.body.work_age = getAge(end_work_date.split('T')[0], start_work_date.split('T')[0])
        req.body.end_work_date = r.ISO8601(req.body.end_work_date)
    } else {
        req.body.age = 0
        req.body.work_age = 0
        req.body.end_work_date = null
    }
    // console.log();
    // console.log(getAge());

    req.body.start_work_date = r.ISO8601(req.body.start_work_date)
    req.body.birthdate = r.ISO8601(req.body.birthdate)

    // console.log(111111111111111111);
    // console.log(req.body);
    // console.log(req.body.start_work_date);
    // console.log(req.body.end_work_date);
    // req.body.start_work_date = r.ISO8601(req.body.start_work_date)
    // req.body.birthdate = r.ISO8601(req.body.birthdate)
    // console.log(req.body);
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
    // let year = Number(req.params.year)
    let now_Date = { now_date: + new Date() }
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
            row(select('field_name')).eq(select('value'))
        )
    };
    // var group_welfare = function () {
    //     return r.db('welfare').table('group_welfare')
    //         .filter({ status_approve: true })
    //         .filter(function (f) {
    //             return r.branch(f('type_continuous').eq(true),
    //                 r.now().inTimezone('+07').ge(f('start_date')),
    //                 r.now().inTimezone('+07').during(f('start_date'), f('end_date'), { rightBound: 'closed' })
    //             )
    //         })
    //         .coerceTo('array')
    // }
    var calculateAge = function (birthday) { // birthday is a date
        var ageDifMs = r.now().toEpochTime().sub(birthday.toEpochTime())
        var ageDate = r.epochTime(ageDifMs); // miliseconds from epoch
        //  return Math.abs(ageDate.year() - 1970);
        return ageDate.year().sub(1970)
    }
    // https://localhost:3000/api/employee/welfares/year/2017/id/411e54dd-b808-4d4d-9984-201b68c70dff
    r.db('welfare').table('employee').get(req.params.id)
        .merge((use) => {
            return {
                work_age: calculateAge(use('start_work_date'))
            }
        })
        .merge((group_welfare) => {
            return {
                group_welfares: r.db('welfare').table('group_welfare')
                    .filter({ status_approve: true })
                    .filter(function (f) {
                        return r.branch(f('type_continuous').eq(true),
                            r.now().inTimezone('+07').ge(f('start_date')),
                            r.now().inTimezone('+07').during(f('start_date'), f('end_date'), { rightBound: 'closed' })
                        )
                    })
                    .coerceTo('array')
                    .merge((welfare_conditions) => {
                        return {
                            welfare_conditions: r.db('welfare').table('welfare').getAll(welfare_conditions('id'), { index: 'group_id' }).coerceTo('array')
                                .merge(function (we_m) {
                                    return {
                                        count: we_m('condition').count(),
                                        countpass: we_m('condition').map(function (con_map) {
                                            return {
                                                pass: checkLogic(r.expr(con_map), group_welfare)
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
                                        welfare_id: status('id'),
                                        group_welfare_name: welfare_conditions('group_welfare_name'),
                                        type_group: welfare_conditions('type_group'),
                                        onetime_use: welfare_conditions('onetime_use'),
                                        group_use: welfare_conditions('group_use'),
                                        type_continuous: welfare_conditions('type_continuous'),
                                        // voluntary_status: welfare_conditions('voluntary_status'),
                                        description: welfare_conditions('description'),
                                        voluntary_status: welfare_conditions('voluntary_status'),
                                    }
                                })
                                .filter({ "count_pass_status": true })
                                .pluck(['budget','budget_emp','description', 'type_group', 'welfare_name', 'group_id', 'welfare_id', 'group_welfare_name'
                                    , 'onetime_use', 'group_use', 'type_continuous', 'voluntary_status', 'round_use'])
                        }
                    })
                    .merge((e) => {
                        return {
                            count_group: e('welfare_conditions').count().eq(0)
                        }
                    })
                    .filter({ "count_group": false })
                    .merge((names) => {
                        return {
                            welfare_conditions: names('welfare_conditions').merge((el) => {
                                return {
                                    budget_use: r.branch(el('type_group').eq('fund'), 
                                    r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                                        .filter({ welfare_id: el('welfare_id'), status: true })
                                        .orderBy(r.desc('date_create'))
                                        .limit(1)
                                        .coerceTo('array')
                                        .getField('budget_use')(0),
                                       r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                                        .filter({ welfare_id: el('welfare_id'), status: true })
                                        .orderBy(r.desc('date_create'))
                                        .coerceTo('array')
                                        .sum('budget_use'))
                                    ,
                                    budget_emp_use:  r.branch(el('type_group').eq('fund'), 
                                    r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                                        .filter({ welfare_id: el('welfare_id'), status: true })
                                        .orderBy(r.desc('date_create'))
                                        .limit(1)
                                        .coerceTo('array')
                                        .getField('budget_emp')(0),
                                    r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                                        .filter({ welfare_id: el('welfare_id'), status: true })
                                        .orderBy(r.desc('date_create'))
                                        .coerceTo('array')
                                        .sum('budget_emp'))
                                }
                            })
                        }
                    })
                    // เช็คคงเหลือ
                    .merge((check_budget) => {
                        return {
                            welfare_conditions: check_budget('welfare_conditions').merge((el) => {
                                return {
                                    budget_balance: r.branch(el('round_use').eq(false),
                                        el('budget'), el('budget').sub(el('budget_use'))),
                                    budget_balance_emp: r.branch(el('round_use').eq(false),
                                        el('budget_emp'), el('budget_emp').sub(el('budget_emp_use')))    
                                    // false, true)
                                    // budget_balance: r.branch(el('type_group').eq('fund'), 0,
                                    //     r.branch(el('round_use').eq(false),
                                    //         el('budget'), el('budget').sub(el('budget_use'))))
                                    // ,
                                    // budget_balance_emp: r.branch(el('type_group').eq('fund'), 0,
                                    //     r.branch(el('round_use').eq(false),
                                    //         el('budget_emp'), el('budget_emp').sub(el('budget_emp_use'))))
                                }
                            })
                        }
                    })
            }
        })
        .merge((item) => {
            return {
                group_welfares: item('group_welfares').count().gt(0).branch(item('group_welfares').getField('welfare_conditions').reduce((l, r) => {
                    return l.add(r)
                }), []),
                birthdate: r.branch(item('birthdate').eq(''),
                    item('birthdate'), item('birthdate').toISO8601().split('T')(0)),
                start_work_date: r.branch(item('start_work_date').eq(''),
                    item('start_work_date'), item('start_work_date').toISO8601().split('T')(0)),
                end_work_date: r.branch(item('end_work_date').eq(null),
                    item('end_work_date'), item('end_work_date').toISO8601().split('T')(0)),
                // เข้าไปเช็คว่าเปิดให้พนักงานแก้ไขข้อมูลหรือไม่
                employee_edit: r.db('welfare').table('system_config')(0)('employee_edit')
            }
        })

        .merge((use_his) => {
            return {
                history_welfare: r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                    .filter({ status: true })
                    .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck('left', { right: ['group_welfare_name', 'onetime'] }).zip()
                    .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck('left', { right: ['welfare_name'] }).zip()
                    .orderBy(r.desc('date_approve'))
                    .merge((mer_oneTime) => {
                        return {
                            history_welfare_id: mer_oneTime('id'),
                            date_use: mer_oneTime('date_use').toISO8601().split('T')(0),
                            date_approve: mer_oneTime('date_approve').toISO8601().split('T')(0),
                            // status: mer_oneTime('status').eq(true).branch(' อนุมัติ', ' ยกเลิก'),
                            description: mer_oneTime('group_welfare_name').add(' (').add(mer_oneTime('welfare_name')).add(')'),
                            // check_onetime_thai: mer_oneTime('onetime').eq(true).branch(' (ใช้ครั้งเดียว)', ' (ใช้หลายครั้ง)')
                        }
                    })
                    .merge((files) => {
                        return {
                            file: files('document_ids').map((doc_id) => {
                                return r.db('welfare').table('files').get(r.db('welfare').table('document_file').get(doc_id).getField('file_id'))
                                    .without('contents')
                            })
                        }
                    })
                    .pluck('history_welfare_id', 'budget_emp', 'budget_use', 'date_use', 'check_onetime_thai', 'date_approve', 'description', 'description_detail', 'status', 'file')
                    .coerceTo('array')
                    
            }
        })
        // กองทุน
        .merge((rvd) => {
            return {
                history_fund: r.db('welfare').table('history_fund').getAll(rvd('personal_id'), { index: 'personal_id' })
                // .filter({'status' : true})
                // // .orderBy({ index: r.desc('date_create') })
                .orderBy(r.desc('date_created'))
                    .merge((id) => {
                        return {
                            history_fund_id: id('id'),
                            date_updated: id('date_updated').toISO8601().split('T')(0),
                            date_created: id('date_created').toISO8601().split('T')(0)
                        }
                    }).without('id')
                    .coerceTo('array')
                    
            }
        })
        // .merge((mer_oneTime) => {
        //     return {
        //         start_work_date: mer_oneTime('start_work_date').toISO8601().split('T')(0),
        //     }
        // })



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
                start_work_date: f('start_work_date'),//.split('T')(0),
                birthdate: f('birthdate').toISO8601()//.split('T')(0)
            }
        })
        .eqJoin('academic_id', r.db('welfare_common').table('academic')).pluck('left', { right: ['academic_name'] }).zip()
        .eqJoin('active_id', r.db('welfare_common').table('active')).pluck('left', { right: ['active_name'] }).zip()
        .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: ['department_name'] }).zip()
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: ['faculty_name'] }).zip()
        .eqJoin('gender_id', r.db('welfare_common').table('gender')).pluck('left', { right: ['gender_name'] }).zip()
        .eqJoin('matier_id', r.db('welfare_common').table('matier')).pluck('left', { right: ['matier_name'] }).zip()
        .eqJoin('position_id', r.db('welfare_common').table('position')).pluck('left', { right: ['position_name'] }).zip()
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck('left', { right: ['prefix_name'] }).zip()
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck('left', { right: ['type_employee_name'] }).zip()
        .without('academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'type_employee_id', 'prefix_id')
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
                                        group_use: welfare_conditions('group_use'),
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
exports.welfaresEmployeeWork = function (req, res) {
    var r = req.r;
    r.db('welfare').table('employee')
        .merge(function (f) {
            return {
                start_work_date: f('start_work_date'),//.split('T')(0),
                birthdate: f('birthdate').toISO8601()//.split('T')(0)
            }
        })
        .eqJoin('academic_id', r.db('welfare_common').table('academic')).pluck('left', { right: ['academic_name'] }).zip()
        .eqJoin('active_id', r.db('welfare_common').table('active')).pluck('left', { right: ['active_name'] }).zip()
        .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: ['department_name'] }).zip()
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: ['faculty_name'] }).zip()
        .eqJoin('gender_id', r.db('welfare_common').table('gender')).pluck('left', { right: ['gender_name'] }).zip()
        .eqJoin('matier_id', r.db('welfare_common').table('matier')).pluck('left', { right: ['matier_name'] }).zip()
        .eqJoin('position_id', r.db('welfare_common').table('position')).pluck('left', { right: ['position_name'] }).zip()
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck('left', { right: ['prefix_name'] }).zip()
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck('left', { right: ['type_employee_name'] }).zip()
        .without('academic_id', 'active_id', 'gender_id', 'matier_id', 'position_id', 'type_employee_id', 'prefix_id')
        // .filter({ active_code: 'WORK' })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}