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
    Object.assign(req.body, data)

    console.log(req.body);
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
        upStatus.date_approve = r.now().inTimezone('+07')
        upStatus.status = "approve"
    })
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
exports.updateRejectWelfare = function (req, res) {
    var r = req.r;
    req.body.map((upStatus) => {
        upStatus.date_approve = r.now().inTimezone('+07')
        upStatus.status = "reject"
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
    console.log(params.id);
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
    let date_use = req.body.date_use || new Date()
    let date_approve = req.body.date_approve || new Date()
    req.body = Object.assign(req.body,
        {
            date_approve: r.ISO8601(date_approve),
            date_create: r.now().inTimezone('+07'),
            date_use: r.ISO8601(date_approve)
        }
    );

    // console.log(,day);
    // console.log(req.body.date_use);

    // console.log(new Date());
    // console.log(date_use,date_approve);
    // console.log(req.body);
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
exports.listHistory = function (req, res) {
    var r = req.r;
    console.log(req.query.year != undefined);
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
    // req.query.date_start = req.query.date_start || new Date(time.setHours(time.getHours() - 168)).toISOString().split('T')[0]
    // req.query.date_end = req.query.date_end || time.toISOString().split('T')[0]
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
    r.db('welfare').table('history_welfare')
        .getAll(true, { index: 'status' })
        .coerceTo('Array')
        .filter(function (f) {
            return f('date_approve').date().during(
                r.ISO8601(date_start),
                r.ISO8601(date_end),
                { rightBound: "closed" }
            )
        })
        .filter({ group_id: req.query.group_id })
        .merge((mer_oneTime) => {
            return {
                date_approve: mer_oneTime('date_approve').toISO8601().split('T')(0)
            }
        })
        .eqJoin('group_id', r.db('welfare').table('group_welfare'))
        .pluck('left', { right: ['group_welfare_name'] }).zip()
        .eqJoin('emp_id', r.db('welfare').table('employee'))
        .pluck('left', { right: ['firstname', 'lastname', 'prefix_id', 'emp_no', 'department_id', 'faculty_id', 'type_employee_id'] }).zip()
        .eqJoin('prefix_id', r.db('welfare_common').table('prefix'))
        .pluck('left', { right: ['prefix_name'] }).zip()
        .filter({
            faculty_id: req.query.faculty_id, department_id: req.query.department_id,
            type_employee_id: req.query.type_employee_id
        })
        .merge((files) => {
            return {
                file: files('document_ids').map((doc_id) => {
                    return r.db('welfare').table('files').get(r.db('welfare').table('document_file').get(doc_id).getField('file_id'))
                        .without('contents')
                })
            }
        })
        .eqJoin('type_employee_id', r.db('welfare_common').table('type_employee')).pluck('left', { right: ['type_employee_name'] }).zip()
        .eqJoin('department_id', r.db('welfare_common').table('department')).pluck('left', { right: ['department_name'] }).zip()
        .eqJoin('faculty_id', r.db('welfare_common').table('faculty')).pluck('left', { right: ['faculty_name'] }).zip()
        .orderBy(r.desc('date_approve'))
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}