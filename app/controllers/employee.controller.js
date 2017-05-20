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
        // active: r.db('welfare_common').table('active').coerceTo('Array'),
        // department: r.db('welfare_common').table('department').coerceTo('Array'),
        // faculty: r.db('welfare_common').table('faculty').coerceTo('Array'),
        // gender: r.db('welfare_common').table('gender').coerceTo('Array'),
        // matier: r.db('welfare_common').table('matier').coerceTo('Array'),
        // position: r.db('welfare_common').table('position').coerceTo('Array'),
        // prefix: r.db('welfare_common').table('prefix').coerceTo('Array'),
        // type_employee: r.db('welfare_common').table('type_employee').coerceTo('Array'),
    })
        .merge((emp) => {
            return {
                emp: r.db('welfare').table('employee').coerceTo('Array')//.limit(1)
                    .merge((merName) => {
                        return {
                            academic_name: emp('academic').filter({ id: merName('academic_id') })//.reduce((left, right) => {
                            // return left.add(right);
                            // }).default('-').pluck('academic_name').getField('academic_name'),
                            // active_name: emp('active').filter({ id: merName('active_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('active_name').getField('active_name'),
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
                            // position_name: emp('position').filter({ id: merName('position_id') }).reduce((left, right) => {
                            //     return left.add(right);
                            // }).default('-').pluck('position_name').getField('position_name'),
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
    req.body.start_work_date = r.ISO8601(req.body.start_work_date).inTimezone('+07:00')
    req.body.birthdate = r.ISO8601(req.body.birthdate).inTimezone('+07:00')
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
    let year = Number(req.params.year)
    let now_Date = { now_date: + new Date() }
    var checkLogic = function (select, row) {
        return r.branch(
            select('logic').eq('=='),
            row(select('field')).eq(select('value')),
            select('logic').eq('>'),
            row(select('field')).gt(select('value')),
            select('logic').eq('>='),
            row(select('field')).ge(select('value')),
            select('logic').eq('<'),
            row(select('field')).lt(select('value')),
            select('logic').eq('<='),
            row(select('field')).le(select('value')),
            row(select('field')).eq(select('value'))
        )
    };
    // https://localhost:3000/api/employee/welfares/year/2017/id/411e54dd-b808-4d4d-9984-201b68c70dff
    r.db('welfare').table('employee').get(req.params.id)
        // .merge(function (emp) {
        //     return {
        //         gender: r.db('welfare_common').table('gender').get(emp('gender_id')).getField('gender_name')
        //     }
        // })
        
        .merge((group_welfare) => {
            return {
                group_welfares: r.db('welfare').table('group_welfare').getAll(true, { index: 'status_approve' })
                    .pluck(['id', 'description', 'onetime'])
                    .merge((welfare_conditions) => {
                        return {
                            welfare_conditions: r.db('welfare').table('welfare').getAll(welfare_conditions('id'), { index: 'group_id' })
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
                                        // id: group_welfare('id')
                                    }
                                })
                                .filter({ "count_pass_status": true })
                                // .pluck(['budget', 'condition', 'welfare_name'])
                                .coerceTo('array')
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
                            welfare_conditions: names('welfare_conditions').reduce((left, right) => {
                                return left.add(right);
                            }).default('-')
                            // .getField('welfare_name')
                        }
                    })
                    .merge((names) => {
                        return {
                            description: names('description').add(' (').add(names('welfare_conditions').getField('welfare_name')).add(')'),
                            budget: names('welfare_conditions').getField('budget'),
                            // budget_use: 100,
                            // budget_balance: 100,
                            welfare_id: names('welfare_conditions').getField('id'),
                            group_id: names('id'),
                            check_onetime_thai: names('onetime').eq(true).branch(' (ใช้ครั้งเดียว)', ' (ใช้หลายครั้ง)')
                        }
                    })
                    //หา _history มีเท่าไร เตรียมเอามาลบ
                    // .merge((mer_his) => {
                    //     return {
                    //         his_length: r.db('welfare').table('history_welfare').getAll(mer_his('welfare_id'), { index: 'welfare_id' })
                    //             .filter({ status: true }).coerceTo('array').count().sub(1)
                    //     }
                    // })
                    // .merge((mer_his) => {
                    //     return {
                    //         his_lengths: mer_his('his_length').eq(-1).branch(0,1)
                    //     }
                    // })
                    // เอามาลบหา ค่าสุดท้ายที่ใช้งาน
                    .merge((check_his_cost) => {
                        return {
                            budget_for_use: r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                             .filter({ welfare_id: check_his_cost('welfare_id'),status: true })
                                // .filter({ status: true, })
                                .coerceTo('array')
                                .orderBy(r.desc('date_approve'))
                        }
                    })
                    // เช็ตว่ามีค่าว่างไหม
                    .merge((check_budget) => {
                        return {
                            budget_use: check_budget('budget_for_use').sum('budget_use'),
                        }
                    })
                    // เช็คคงเหลือ
                    .merge((check_budget) => {
                        return {
                            budget_balance: check_budget('budget_for_use').count().eq(0).branch(
                                check_budget('budget')
                                ,
                                check_budget('budget_for_use')(0).getField('budget_balance'))//check_budget('budget').sub(check_budget('budget_use'))
                        }
                    })

                    // .without('welfare_conditions', 'id','budget_for_use')
                    .coerceTo('array')
            }
        })
        .merge((use_his) => {
            return {
                history_welfare: r.db('welfare').table('history_welfare').getAll(req.params.id, { index: 'emp_id' })
                    .filter({ status: true })
                    .orderBy(r.desc('date_approve'))
                    .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck('left', { right: ['group_welfare_name', 'onetime'] }).zip()
                    .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck('left', { right: ['welfare_name'] }).zip()
                    .merge((mer_oneTime) => {
                        return {
                            date_approve: mer_oneTime('date_approve').toISO8601().split('T')(0),
                            status: mer_oneTime('status').eq(true).branch(' อนุญาติ', ' ยกเลิก'),
                            description: mer_oneTime('group_welfare_name').add(' (').add(mer_oneTime('welfare_name')).add(')'),
                            check_onetime_thai: mer_oneTime('onetime').eq(true).branch(' (ใช้ครั้งเดียว)', ' (ใช้หลายครั้ง)')
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
                    .pluck('budget_use', 'check_onetime_thai', 'date_approve', 'description', 'history_detail', 'status','file')
                    .coerceTo('array')
            }
        })
        .merge((mer_oneTime) => {
            return {
                start_work_date: mer_oneTime('start_work_date').toISO8601().split('T')(0),
            }
        })
        .merge(function (f) {
            return {
                start_work_date: f('start_work_date'),//.split('T')(0),//.split('T')(0),
                birthdate: f('birthdate').toISO8601().split('T')(0),//f('birthdate').split('T')(0)
                academic_name: r.db('welfare_common').table('academic').get(f('academic_id')).getField('academic_name'),
                active_name: r.db('welfare_common').table('active').get(f('active_id')).getField('active_name'),
                active_code: r.db('welfare_common').table('active').get(f('active_id')).getField('active_code'),
                department_name: r.db('welfare_common').table('department').get(f('department_id')).getField('department_name'),
                faculty_name: r.db('welfare_common').table('faculty').get(f('faculty_id')).getField('faculty_name'),
                gender_name: r.db('welfare_common').table('gender').get(f('gender_id')).getField('gender_name'),
                matier_name: r.db('welfare_common').table('matier').get(f('matier_id')).getField('matier_name'),
                position_name: r.db('welfare_common').table('position').get(f('position_id')).getField('position_name'),
                prefix_name: r.db('welfare_common').table('prefix').get(f('prefix_id')).getField('prefix_name'),
                type_employee_name: r.db('welfare_common').table('type_employee').get(f('type_employee_id')).getField('type_employee_name'),

            }
        })
        // .merge((check_welFare)=>{
        //     return {
        //         xxxxx:check_welFare('group_welfares')
        //     }
        // })
        // .without('group_welfares')
        // .eqJoin('academic_id', r.db('welfare_common').table('academic')).pluck('left', { right: ['academic_name'] }).zip()
        // .eqJoin('active_id', r.db('welfare_common').table('active')).pluck('left', { right: ['active_name'] }).zip()
        // .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: ['department_name'] }).zip()
        // .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: ['faculty_name'] }).zip()
        // .eqJoin('gender_id', r.db('welfare_common').table('gender')).pluck('left', { right: ['gender_name'] }).zip()
        // .eqJoin('matier_id', r.db('welfare_common').table('matier')).pluck('left', { right: ['matier_name'] }).zip()
        // .eqJoin('position_id', r.db('welfare_common').table('position')).pluck('left', { right: ['position_name'] }).zip()
        // .eqJoin('prefix_id', r.db('welfare_common').table('prefix')).pluck('left', { right: ['prefix_name'] }).zip()
        // .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck('left', { right: ['type_employee_name'] }).zip()
        // .without('academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'type_employee_id', 'prefix_id')
        // .merge((group_welfare) => {
        //     return {
        //         rvd_status: r.branch(group_welfare('type_employee_name').eq('พนักงานมหาวิทยาลัย'), true, false),
        //         group_welfare: r.db('welfare').table('group_welfare').getAll(year, { index: 'year' })
        //             .filter({ status_approve: true })
        //             .merge((welfare_conditions) => {
        //                 return {
        //                     conditions: r.db('welfare').table('welfare').getAll(welfare_conditions('id'), { index: 'group_id' })
        //                         .merge((mer_id) => {
        //                             return {
        //                                 welfare_id: mer_id('id'),
        //                                 year: welfare_conditions('year'),
        //                                 admin_use: welfare_conditions('admin_use'),
        //                                 onetime: welfare_conditions('onetime'),
        //                                 group_welfare_name: welfare_conditions('group_welfare_name'),
        //                                 start_date: r.ISO8601(welfare_conditions('start_date')).toEpochTime(),
        //                                 end_date: r.ISO8601(welfare_conditions('end_date')).toEpochTime(),
        //                                 now_date: r.now().toEpochTime()
        //                             }
        //                         })
        //                         .without('id')
        //                         .coerceTo('array')
        //                 }
        //             })
        //             .coerceTo('array')
        //     }
        // })
        // .merge((welfare) => {
        //     return {
        //         welfare: welfare('group_welfare').getField('conditions').count()
        //             .eq(0)
        //             .branch([], welfare('group_welfare').getField('conditions')
        //                 // remove array 1 dimintion
        //                 .reduce(function (left, right) {
        //                     return left.add(right);
        //                 })
        //                 .merge((conditions) => {
        //                     return {
        //                         condition: conditions('condition').merge((changeName) => {
        //                             return {
        //                                 field: r.db('welfare').table('condition').get(changeName('field')).getField('field')
        //                             }
        //                         })
        //                     }
        //                 })
        //                 .merge(function (we_m) {
        //                     return {
        //                         count: we_m('condition').count(),
        //                         countpass: we_m('condition').map(function (con_map) {
        //                             return {
        //                                 pass: welfare(con_map('field')).do(function (d) {
        //                                     return r.branch(con_map('logic').eq(">="),
        //                                         d.ge(con_map('value')),
        //                                         r.branch(con_map('logic').eq(">"),
        //                                             d.gt(con_map('value')),
        //                                             r.branch(con_map('logic').eq("<="),
        //                                                 d.le(con_map('value')),
        //                                                 r.branch(con_map('logic').eq("<"),
        //                                                     d.lt(con_map('value')),
        //                                                     r.branch(con_map('logic').eq("=="),
        //                                                         d.eq(con_map('value')),
        //                                                         d.ne(con_map('value'))
        //                                                     )
        //                                                 )
        //                                             )
        //                                         )
        //                                     )
        //                                 })
        //                             }
        //                         })
        //                     }
        //                 })
        //                 .merge((e) => {
        //                     return {
        //                         countpass_total: e('countpass').filter({ "pass": true }).count()
        //                     }
        //                 })
        //                 .merge((status) => {
        //                     return {
        //                         count_pass_status: status('countpass_total').eq(status('count')),
        //                         id: welfare('id')
        //                     }
        //                 })
        //                 .filter({ "count_pass_status": true })
        //                 .merge((use_his) => {
        //                     return {
        //                         budget_use: r.db('welfare').table('history_welfare')
        //                             .getAll(welfare('id'), { index: 'emp_id' })
        //                             .filter(
        //                             {
        //                                 status: 'approve',
        //                                 //  emp_id: welfare('id'),
        //                                 welfare_id: use_his('welfare_id')
        //                             }
        //                             )
        //                             .sum('use_budget'),
        //                         budget_per_use: r.db('welfare').table('history_welfare')
        //                             .getAll(welfare('id'), { index: 'emp_id' })
        //                             .filter((status) => {
        //                                 return status('status').eq('approve').or(status('status').eq('request'))
        //                             })
        //                             .filter(
        //                             {
        //                                 welfare_id: use_his('welfare_id')
        //                             }
        //                             )
        //                             .sum('use_budget')




        //                     }
        //                 })
        //                 .merge((balance) => {
        //                     return {
        //                         budget_balance: balance('budget').sub(balance('budget_use')),
        //                         budget_balance_check: balance('budget').sub(balance('budget_use')).le(0).branch(true, false)
        //                     }
        //                 })
        //                 .merge((check_onetime) => {
        //                     return {
        //                         check_onetime_thai: check_onetime('onetime').branch('ใช้ได้ครั้งเดียว', 'ใช้ได้หลายครั้ง')
        //                     }
        //                 })
        //                 // เอาสวัสดิการที่ยังมีเงินเหลือออกมาแสดง
        //                 .filter({ "budget_balance_check": false })
        //                 .without('condition', 'countpass')
        //             )
        //     }
        // })

        // .merge((use_his) => {
        //     return {

        //         history_welfare: r.db('welfare').table('history_welfare')
        //             // .filter({ emp_id: use_his('id'), year: year })

        //             .getAll(use_his('id'), { index: 'emp_id' })

        //             .filter({ year: year })
        //             .orderBy(r.desc('date_use'))
        //             .merge((name_welfare) => {
        //                 return {
        //                     date_use: name_welfare('date_use').split('T')(0),
        //                     date_approve: name_welfare.hasFields('date_approve').branch(name_welfare('date_approve').split('T')(0), false),//,
        //                     name: r.db('welfare').table('group_welfare').get(r.db('welfare').table('welfare').get(name_welfare('welfare_id')).getField('group_id')).getField('group_welfare_name'),
        //                     history_welfare_id: name_welfare('id'),
        //                     onetime: r.db('welfare').table('group_welfare').get(r.db('welfare').table('welfare').get(name_welfare('welfare_id')).getField('group_id')).getField('onetime'),
        //                 }
        //             })
        //             .merge((files) => {
        //                 return {
        //                     file: files('document_ids').map((doc_id) => {
        //                         return r.db('welfare').table('files').get(r.db('welfare').table('document_file').get(doc_id).getField('file_id'))
        //                             .without('contents')
        //                     })
        //                 }
        //             })
        //             .merge((check_onetime) => {
        //                 return {
        //                     check_onetime_thai: check_onetime('onetime').branch('ใช้ได้ครั้งเดียว', 'ใช้ได้หลายครั้ง')
        //                 }
        //             })
        //             .without('id')
        //             .orderBy(r.desc('date_use'))
        //             .coerceTo('array')
        //     }
        // })
        // .merge((checkTrue) => {
        //     return {
        //         welfare: checkTrue('welfare').merge((e) => {
        //             return {
        //                 emp_work: checkTrue('active_code').eq('WORK'),//"active_code": "WORK",,
        //                 status_approve: checkTrue('history_welfare').filter({ status: 'request', welfare_id: e('welfare_id') }).count().gt(0),//e('welfare_id'),
        //                 welfare_old: e('start_date').ge(e('now_date')).branch(true,
        //                     e('end_date').ge(e('now_date')).branch(false, true))
        //             }
        //         })
        //         // 
        //     }
        // })
        // .merge((withOutHistorty) => {
        //     return {
        //         history_welfare: withOutHistorty('history_welfare').filter({ status: true })
        //     }
        // })
        // .without('group_welfare')

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
        .without('academic_id', 'active_id', 'department_id', 'faculty_id', 'gender_id', 'matier_id', 'position_id', 'type_employee_id', 'prefix_id')
        // .filter({ active_code: 'WORK' })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}