exports.historyEmp = function (req, res) {

    r.db('welfare').table('history_welfare').getAll(req.params.emp_id, { index: 'emp_id' })
        .filter({ status: true })

        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck('left', { right: ['group_welfare_name', 'onetime'] }).zip()
        .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck('left', { right: ['welfare_name'] }).zip()
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
                        .without('contents', 'ref_path', 'timestamp', 'type')
                })
            }
        })
        .pluck('history_welfare_id', 'budget_use', 'date_use', 'check_onetime_thai', 'date_approve', 'description', 'description_detail', 'status', 'file')
        .coerceTo('array')
        .orderBy(r.desc('date_approve'))
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.unapprove = function (req, res) {
    r.db('welfare').table('history_welfare')
        // .filter({status: false})
        .getAll('request', { index: 'status' })
        .orderBy('date_use')
        .merge((user) => {
            return {
                date_use: user('date_use').split('T')(0),
                data: r.db('welfare').table('employee').get(user('emp_id'))
            }
        })
        .merge((getFileName) => {
            return {
                file: getFileName('document_ids').map((doc_id) => {
                    return r.db('welfare').table('files').get(r.db('welfare').table('document_file').get(doc_id).getField('file_id'))
                        .without('contents')
                })
            }
        })
        .merge((userName) => {
            return {
                budget: r.db('welfare').table('welfare').get(userName('welfare_id')).getField('budget'),
                history_welfare_budget: r.db('welfare').table('history_welfare').getAll(userName('emp_id'), { index: 'emp_id' }).filter({ status: "approve", welfare_id: userName('welfare_id') }).sum('use_budget')
                //.getAll(userName('welfare_id'), { index: 'welfare_id' }).filter({status: "approve"}).sum('use_budget')
                ,
                group_welfare_name: r.db('welfare').table('group_welfare').get(userName('group_id')).getField('group_welfare_name'),
                prefix_name: r.db('welfare_common').table('prefix').get(userName('data').getField('prefix_id')).getField('prefix_name'),
                firstname: userName('data').getField('firstname'),
                lastname: userName('data').getField('lastname'),
                personal_id: userName('data').getField('personal_id'),
                faculty_name: r.db('welfare_common').table('faculty').get(userName('data').getField('faculty_id')).getField('faculty_name')
            }
        })
        .merge((money) => {
            return {
                budget_cover: money('budget').sub(money('history_welfare_budget')),
            }
        })
        .without('data')

        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.requestWelfare = function (req, res) {
    // https://localhost:3000/api/employee/use_welfare/
    //     for (let prop in req.body) {
    //      req.body[prop] = req.body[prop].replace(/ /g,'').trim()
    //   }   
    // console.log(req.body.document_ids);
    let data = {
        date_use: r.now().inTimezone('+07')
    }
    // Object.assign(req.body, data)

    // console.log(req.body);
    var r = req.r;
    r.db('welfare').table('history_welfare').insert(req.body)('generated_keys')(0)
        .do((history_id) => {
            return r.db('welfare').table('history_welfare').get(history_id).getField('document_ids').forEach((doc_update) => {
                return r.db('welfare').table('document_file').get(doc_update).update({ doc_status: true })
            })
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.updateApproveWelfare = function (req, res) {
    var r = req.r;
    req.body.map((upStatus) => {
        upStatus.date_approve = r.ISO8601(date_approve)//.inTimezone('+07'),
        upStatus.date_create = r.now().inTimezone('+07')
        upStatus.date_use = r.ISO8601(date_approve)//.inTimezone('+07'),
    })
    r.expr(req.body).forEach(function (fe) {
        return r.db('welfare').table('history_welfare').get(fe('id'))
            .update({
                date_approve: fe('date_approve'),
                date_create: fe('date_create'),
                date_use: fe('date_use'),
                status: fe('status')
            }, { nonAtomic: true })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.updateRejectWelfare = function (req, res) {
    var r = req.r;
    req.body.map((upStatus) => {
        // upStatus.date_approve = r.now().inTimezone('+07')
        upStatus.date_update = r.now().inTimezone('+07')
        upStatus.status = false
    })
    // console.log('>>>>>>',req.body);
    r.expr(req.body).forEach(function (fe) {
        return r.db('welfare').table('history_welfare').get(fe('id'))
            .update({
                date_update: fe('date_update'),
                status: fe('status')
            }, { nonAtomic: true })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.updateCancelWelfare = function (req, res) {
    var r = req.r;
    req.body.map((upStatus) => {
        upStatus.date_approve = r.now().inTimezone('+07')
        upStatus.status = "cancel"
    })
    // console.log('>>>>>>',req.body);
    r.expr(req.body).forEach(function (fe) {
        return r.db('welfare').table('history_welfare').get(fe('id'))
            .update({
                date_approve: fe('date_approve'),
                status: fe('status')
            }, { nonAtomic: true })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listUploadHistory = function (req, res) {
    var r = req.r;
    var params = req.params;
    // console.log(params.id);
    // console.log('params=>',params);
    r.db('welfare').table('history_welfare').get(params.id)
        .merge((doc_id) => {
            return {
                files: doc_id('document_ids').map((file) => {
                    return {
                        file: r.db('welfare').table('document_file').get(file).merge((me_file) => {
                            return r.db('welfare').table('files').get(me_file('file_id'))
                        })
                            .merge(function (m) {
                                return {
                                    timestamp: m('timestamp').toISO8601().split("T")(0)
                                }
                            })
                            .merge(function (row) {
                                return {
                                    name: row('name').add(' | ')
                                        .add(row('timestamp'))
                                    ,
                                    progress: 100, complete: true
                                }
                            })
                            .without('contents')
                    }
                })
            }
        })
        .getField('files')
        .getField('file')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .error(function (err) {
            res.json(err);
        })
}
exports.adminApprove = function (req, res) {
    var r = req.r;
    let date_use = req.body.date_use || new Date().toISOString()
    let date_approve = req.body.date_approve || new Date().toISOString()
    req.body = Object.assign(req.body,
        {
            date_approve: r.ISO8601(date_approve),//.inTimezone('+07'),
            date_create: r.now().inTimezone('+07'),
            date_use: r.ISO8601(date_approve),//.inTimezone('+07'),
        }
    );
    // console.log( req.body);
    r.db('welfare').table('history_welfare').insert(req.body)('generated_keys')(0)
        .do((history_id) => {
            return r.db('welfare').table('history_welfare').get(history_id).getField('document_ids').forEach((doc_update) => {
                return r.db('welfare').table('document_file').get(doc_update).update({ doc_status: true })
            })
        })
        .run()
        .then(function (result) {
            res.json(result);
            // res.json([]);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listWelfare = function (req, res) {
    var r = req.r;
    // console.log(req.body);
    query = req.query
    if(query.year !== undefined)
        query.year = Number(query.year)
    // console.log(query);    personal_id
    r.db('welfare').table('history_welfare').getAll(query.personal_id, { index: 'personal_id' })
        .filter({ status: true })
        .merge((mer_oneTime) => {
            return {
                year: mer_oneTime('date_approve').year()
            }
        })
        .filter({
            year: query.year
        })
        .eqJoin('group_id', r.db('welfare').table('group_welfare')).pluck('left', { right: ['group_welfare_name', 'description', 'onetime'] }).zip()
        .eqJoin('welfare_id', r.db('welfare').table('welfare')).pluck('left', { right: ['welfare_name'] }).zip()
        .orderBy(r.desc('date_approve'))
        .merge((mer_oneTime) => {
            return {
                history_welfare_id: mer_oneTime('id'),
                date_use: mer_oneTime('date_use').toISO8601().split('T')(0),
                date_approve: mer_oneTime('date_approve').toISO8601().split('T')(0),
                group_welfare_name: mer_oneTime('group_welfare_name'),
                welfare_name: mer_oneTime('welfare_name'),
                descriptions_group: mer_oneTime('description')
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
        .pluck('history_welfare_id','type_group', 'budget_emp', 'budget_use', 'group_welfare_name',
        'welfare_name', 'descriptions_group', 'date_use', 'check_onetime_thai', 'date_approve',
         'description_detail', 'status', 'file')
        .run()
        .then(function (result) {

            res.json(result);

            // res.json([]);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listFund = function (req, res) {
    var r = req.r;
    // console.log(req.body);
    query = req.query
    if(query.year !== undefined)
        query.year = Number(query.year)
    // console.log(query);
    r.db('welfare').table('history_fund')
        .getAll(query.personal_id, { index: 'personal_id' })
        .filter({
            fund_year: query.year
        })
        .orderBy(r.desc('date_created'))
        .merge((id) => {
            return {
                history_fund_id: id('id'),
                date_updated: id('date_updated').toISO8601().split('T')(0),
                date_created: id('date_created').toISO8601().split('T')(0)
            }
        }).without('id')
        .run()
        .then(function (result) {

            res.json(result);

            // res.json([]);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.rejectRvd = function (req, res) {
    var r = req.r;
    req.body = Object.assign(req.body,
        {
            date_update: r.now().inTimezone('+07'),
            status: false
        }
    );
    // console.log( req.body);
    r.db('welfare').table('history_rvd').update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
            // res.json([]);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.usegroup = function (req, res) {
    var r = req.r;
    let body = req.body
    let group_id = req.body[0].group_id || ''
    r.db('welfare').table('history_welfare')
    r.expr({
        emps: body,
        group_welfare: r.db('welfare').table('welfare').getAll(group_id, { index: 'group_id' }).coerceTo('array')
        .merge((item)=>{
            return {
                type_group: r.db('welfare').table('group_welfare').get(group_id).getField('type_group')
            }
        })
    })
        .merge((emp) => {
            return {
                emps: emp('emps').merge((em) => {
                    return r.db('welfare').table('employee').get(em('id'))
                        .without('academic_name', 'active_name', 'date_create', 'date_update', 'department_name', 'dob', 'end_work_date', 'emp_no', 'faculty_name', 'firstname', 'gender_name'
                        , 'lastname', 'matier_name', 'position_name', 'prefix_name', 'type_employee_name')
                })
            }
        })
        .merge((welfare) => {
            var emps = welfare('emps')
            return {
                welfare: welfare('group_welfare').merge((em) => {
                    var condition = em('condition');
                    return {
                        countCon: condition.count(),
                        reduce: getEmployee(emps, condition).merge((budget) => {
                            return {
                                budget_balance: 0,
                                type_group:em('type_group'),
                                budget_cover: em('budget'),
                                budget_use: em('budget'),
                                budget_emp: em('budget_emp'),
                                date_approve: r.now().inTimezone('+07'),
                                date_create: r.now().inTimezone('+07'),
                                // date_update: r.now().inTimezone('+07'),
                                date_use: r.now().inTimezone('+07'),
                                document_ids: [],
                                group_id: group_id,
                                status: true,
                                welfare_id: em('id'),
                                emp_id: budget('id')
                            }
                        })
                        .pluck('budget_balance','type_group', 'budget_cover', 'budget_use', 'budget_emp', 'date_approve',
                            'date_use', 'date_update', 'document_ids', 'emp_id', 'group_id', 'status', 'welfare_id', 'emp_id', 'personal_id')
                    }
                }),
            }
        })
        .pluck('welfare')
        .getField('welfare')('reduce')
        // .merge((insert) => {
        //     return {      // r.db('welfare').table('history_welfare').insert('reduce') 

        //         result:r.db('welfare').table('history_welfare').insert(insert('reduce')) 
        //     }
        // })
        .reduce((l, r) => {
            return l.add(r)
        })
        .run()
        .then(function (result) {
            // console.log(2);
            r.db('welfare').table('history_welfare').insert(result).run()
                .then(function (result) {
                    // console.log(2);
                    res.json(result);
                    // res.json([]);
                })
                .catch(function (err) {
                    res.status(500).json(err);
                })
            // res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}

exports.listHistory = function (req, res) {
    var r = req.r;
    // console.log(req.query.year != undefined);
    if (req.query.year != undefined) {
        // console.log(req.query.year);
        // let year =  parseInt(req.query.year)
        // console.log(year);
        req.query = Object.assign(req.query,
            {
                year: parseInt(req.query.year)
            }
        );
    }
    if (req.query.status == undefined) {
        req.query = Object.assign(req.query,
            {
                status: 'approve'
            }
        );
    }
    let time = new Date()

    // console.log('>>>>>>>>oldday>>>>>',today.setMonth(today.getMonth() + 1));
    req.query.date_start = req.query.date_start || new Date(time.setHours(time.getHours() - 168)).toISOString().split('T')[0]
    req.query.date_end = req.query.date_end || time.toISOString().split('T')[0]
    // console.log('>>>>>>>>>>',req.query.date_start,req.query.date_end );
    var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
    var date_end = req.query.date_end + "T00:00:00+07:00";

    // req.query.department_id
    // ==req.query.year
    // req.query.group_id
    // req.query.type_employee_id
    // req.query.faculty_id
    // req.query.date_start
    // req.query.date_end
    // let chengeyear
    // console.log(111111111111111111111111);
    // r.expr({
    //     emp: r.db('welfare_common').table('employee').coerceTo('Array'),
    //     history_welfare: r.db('welfare').table('history_welfare')
    //         .getAll(true, { index: 'status' })
    //         .orderBy(r.desc('date_approve')).coerceTo('Array')
    // })
    // r.db('welfare').table('history_welfare')
    //     .getAll(true, { index: 'status' })
    //     .coerceTo('Array')
    //     .filter(function (f) {
    //         return f('date_approve').date().during(
    //             r.ISO8601(date_start),
    //             r.ISO8601(date_end),
    //             { rightBound: "closed" }
    //         )
    //     })
    //     .filter({ group_id: req.query.group_id })
    //     .merge((mer_oneTime) => {
    //         return {
    //             date_approve: mer_oneTime('date_approve').toISO8601().split('T')(0)
    //         }
    //     })
    //     .eqJoin('group_id', r.db('welfare').table('group_welfare'))
    //     .pluck('left', { right: ['group_welfare_name'] }).zip()
    //     .eqJoin('emp_id', r.db('welfare').table('employee'))
    //     .pluck('left', { right: ['firstname', 'lastname', 'prefix_id', 'emp_no', 'department_id', 'faculty_id', 'type_employee_id'] }).zip()
    //     .eqJoin('prefix_id', r.db('welfare_common').table('prefix'))
    //     .pluck('left', { right: ['prefix_name'] }).zip()
    //     .filter({
    //         faculty_id: req.query.faculty_id, department_id: req.query.department_id,
    //         type_employee_id: req.query.type_employee_id
    //     })
    //     .merge((files) => {
    //         return {
    //             file: files('document_ids').map((doc_id) => {
    //                 return r.db('welfare').table('files').get(r.db('welfare').table('document_file').get(doc_id).getField('file_id'))
    //                     .without('contents')
    //             })
    //         }
    //     })
    //     .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck('left', { right: ['type_employee_name'] }).zip()
    //     .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: ['department_name'] }).zip()
    //     .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: ['faculty_name'] }).zip()
    //     .orderBy(r.desc('date_approve'))
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
    var calculateAge = function (birthday) { // birthday is a date
        var ageDifMs = r.now().toEpochTime().sub(birthday.toEpochTime())
        var ageDate = r.epochTime(ageDifMs); // miliseconds from epoch
        //  return Math.abs(ageDate.year() - 1970);
        return ageDate.year().sub(1970)
    }
    let params = req.query
    params.personal_name = params.personal_name || ''
    // console.log('sssssssssssssssssssss', params.group_id === undefined)
    let querys = ''
    if (req.query.group_id === undefined) {
        querys = r.db('welfare').table('employee')
            .merge((name) => {
                return {
                    full_name: name('firstname').add("").add(name('lastname'))
                }
            })
            .filter(
            r.row('full_name').match(params.personal_name)
            )
            .filter({
                personal_id: params.personal_id,
                type_employee_id: params.type_employee_id,
                department_id: params.department_id,
                faculty_id: params.faculty_id,
                active_id: params.active_id
            })
            .pluck('id', 'birthdate', 'start_work_date', 'personal_id', 'prefix_name', 'firstname', 'lastname', 'type_employee_name')
            .merge((use) => {
                return {
                    birthdate_cal: calculateAge(use('birthdate')),
                    start_work_date_cal: calculateAge(use('start_work_date')),
                    budget_balance: 0,
                    budget_cover: 0,
                    budget_use: 0,
                }
            })
        // console.log(params.personal_id);
    } else {
        var date_start = req.query.date_start + "T00:00:00+07:00"; //year+"-"+month+"-01"
        var date_end = req.query.date_end + "T00:00:00+07:00";
        querys = r.expr({
            employees: r.db('welfare').table('employee')
                .without('active_name', 'dob', 'emp_no')
                .merge((name) => {
                    return {
                        full_name: name('firstname').add("").add(name('lastname'))
                    }
                })
                .filter(
                r.row('full_name').match(params.personal_name)
                )
                .filter({
                    personal_id: params.personal_id,
                    type_employee_id: params.type_employee_id,
                    department_id: params.department_id,
                    faculty_id: params.faculty_id,
                    active_id: params.active_id
                })

                .coerceTo('Array'),
            group_welfare: r.db('welfare').table('group_welfare').get(params.group_id)
        })
            .merge((group_merge) => {
                return {
                    welfare: r.db('welfare').table('welfare').getAll(params.group_id, { index: 'group_id' })
                        .merge(function (wel_merge) {
                            return {
                                condition: wel_merge('condition')
                                    .eqJoin('field', r.db('welfare').table('condition')).pluck("left", { right: "field" }).zip()
                                    .coerceTo('array')
                            }
                        })
                        .merge(function (wel_merge) {
                            return {
                                countCon: wel_merge('condition').count(),
                                employee: r.branch(wel_merge('condition').count().eq(0),
                                    [group_merge('employees').pluck("id")],
                                    wel_merge('condition').map(function (con_map) {
                                        return group_merge('employees').filter(function (f) {
                                            return checkLogic(con_map, f)
                                        }).coerceTo('array').pluck('id')
                                    })
                                )
                            }
                        })
                        .coerceTo('array')
                        .merge(function (wel_merge) {
                            return {
                                employee: wel_merge('employee').reduce(function (l, r) {
                                    return l.add(r)
                                })
                                    .group('id').count().ungroup()
                                    .filter(function (emp_filter) {
                                        return r.branch(wel_merge('countCon').eq(0),
                                            emp_filter('reduction').eq(wel_merge('countCon').add(1)),
                                            emp_filter('reduction').eq(wel_merge('countCon'))
                                        )
                                    })//.getField('group')
                            }
                        })
                }
            })
            .without('employees')
            .merge((group_use) => {
                return group_use('welfare').merge((admin) => {
                    return {
                        group_use: group_use('group_welfare')('group_use')
                    }
                })
            })
            .merge((set) => {
                return set('employee').merge((set2) => {
                    return {
                        budget: set('budget'),
                        group_use: set('group_use'),
                        welfare_id: set('id'),
                    }
                })
            })
            // // .getField('welfare')
            // // .merge((budget) => {
            // //     return budget.merge((getBudget) => {
            // //         return {
            // //             employee: getBudget('employee').merge((setBudget) => {
            // //                 return {
            // //                     budget: getBudget('budget')
            // //                 }
            // //             })
            // //         }
            // //     })
            // // })
            // // .getField('employee')
            .reduce(function (l, r) {
                return l.add(r)
            })
            .group('group').ungroup()
            .merge((getBudget) => {
                return {
                    budget_cover: getBudget('reduction')(0)('budget'),
                    group_use: getBudget('reduction')(0)('group_use'),
                    welfare_id: getBudget('reduction')(0)('welfare_id'),
                }
            })
            .without('reduction')
            .eqJoin('group', r.db('welfare').table('employee')).zip()
            .pluck('birthdate', 'start_work_date', 'id', 'welfare_id', 'personal_id', 'group_use', 'budget_cover', 'prefix_name', 'firstname', 'lastname', 'type_employee_name')
            .merge((his) => {
                return {
                    group_id: params.group_id,
                    budget_use: r.db('welfare').table('history_welfare').getAll(his('id'), { index: 'emp_id' })
                        // .filter(function (f) {
                        //     return f('date_approve').date().during(
                        //         r.ISO8601(date_start),
                        //         r.ISO8601(date_end),
                        //         { rightBound: "closed" }
                        //     )
                        // })
                        .filter({ group_id: params.group_id, status: true })
                        .coerceTo('array')
                    // .sum('budget_use')
                }
            })
            .merge((use) => {
                return {
                    history_welfare_id: r.branch(use('budget_use').eq([]), '',
                        use('budget_use')(0)('id')),//.reduce(function (l, r) {
                    //     return l.add(r)
                    // }),//[0],//('id'),
                    budget_use: use('budget_use').sum('budget_use'),
                }
            })
            .merge((use) => {
                return {
                    birthdate_cal: calculateAge(use('birthdate')),
                    start_work_date_cal: calculateAge(use('start_work_date')),
                    budget_balance: use('budget_cover').sub(use('budget_use')),
                    check: false
                }
            })
    }
    querys
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}

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
        row(select('field_name')).ne(select('value'))
    )
};
var getEmployee = function (emp, con) {
    var countCon = con.count();
    return r.branch(countCon.gt(1),
        con.reduce(function (left, right) {
            return r.branch(left.hasFields('data'),
                {
                    data: left('data').filter(function (f) {
                        return checkLogic(right, f)
                    })
                },
                {
                    data: emp
                        .filter(function (f) {
                            return checkLogic(left, f)
                        })
                        .filter(function (f) {
                            return checkLogic(right, f)
                        })
                }
            )
        })('data'),
        countCon.eq(1),
        emp.filter(function (f) {
            return checkLogic(con(0), f)
        }),
        emp
    )
}