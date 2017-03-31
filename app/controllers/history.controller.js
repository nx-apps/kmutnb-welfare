exports.unapprove = function (req, res) {
    r.db('welfare').table('history_welfare')
        // .filter({status: false})
        .getAll('request', { index: 'status' })
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
                history_welfare_budget: r.db('welfare').table('history_welfare').getAll(userName('welfare_id'), { index: 'welfare_id' }).sum('use_budget'),
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
        date_use: new Date().toISOString()
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
        upStatus.date_approve = new Date().toISOString()
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
        upStatus.date_approve = new Date().toISOString()
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
    req.body = Object.assign(req.body,
        {
            date_approve: new Date().toISOString()
        }
    );
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
exports.listHistory = function (req, res) {
    var r = req.r;
    r.db('welfare').table('history_welfare')
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
                history_welfare_budget: r.db('welfare').table('history_welfare').getAll(userName('welfare_id'), { index: 'welfare_id' }).sum('use_budget'),
                group_welfare_name: r.db('welfare').table('group_welfare').get(userName('group_id')).getField('group_welfare_name'),
                prefix_name: r.db('welfare_common').table('prefix').get(userName('data').getField('prefix_id')).getField('prefix_name'),
                firstname: userName('data').getField('firstname'),
                lastname: userName('data').getField('lastname'),
                personal_id: userName('data').getField('personal_id'),
                faculty_name: r.db('welfare_common').table('faculty').get(userName('data').getField('faculty_id')).getField('faculty_name')
            }
        })
        .filter((status)=>{
            return status('status').eq('approve').or(status('status').eq('reject'))
        })
        .merge((money) => {
            return {
                budget_cover: money('budget').sub(money('history_welfare_budget')),
                status_thai : money('status').eq('approve').branch('อนุมัติ','ไม่อนุมัติ')
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