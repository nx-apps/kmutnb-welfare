exports.getrvd = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup').getAll(req.params.pid, { index: 'personal_id' })
        // .filter({ status: "active" })
        .eqJoin('rvd_id', r.db('welfare').table('rvd'))
        .without({ right: ['id', 'status'] })
        .zip()
        .merge((date) => {
            return {
                date_signup: date('date_signup').split('T')(0),
                date_approve: date('date_approve').split('T')(0)
            }
        })
        .orderBy('date_approve')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.signup = function (req, res) {
    var r = req.r
    let data = {
        date_signup: new Date().toISOString(),
        date_approve: new Date().toISOString(),
        status: 'sign'
    }
    Object.assign(req.body, data)

    // console.log(req.body);
    // r.db('welfare').table('rvd_signup')
    //     .getAll(req.body.personal_id, { index: 'personal_id' })
    //     .merge((check)=>{

    //     })
    r.expr({})
        .merge((x) => {
            return {
                emp: r.db('welfare').table('rvd_signup').getAll(req.body.personal_id, { index: 'personal_id' }).coerceTo('array')
            }
        })
        .merge((check) => {
            return {
                // เช์คว่ามี not ไหม ถ้ามี ก็เพิ่มไม่ได้ 
                //      ถ้าไม่มีก็มาเช็คต่อว่ามี active ไหม ถ้ามีก็ไปอัพเดตอันเก่าเป็น changed แล้วเพิ่มอันใหม่
                //          ถ้าไม่มีก็เพิ่มอันใหม่
                insert_status: check('emp').filter({ status: "not" }).count().gt(0).branch(false,
                    check('emp').filter({ status: "active" }).count().gt(0).branch(
                        check('emp').filter({ status: "active" }).merge((check_active) => {
                            return r.db('welfare').table('rvd_signup').get(check_active('id'))
                                .update({ status: "leave" })
                                .merge((insert) => {
                                    return r.db('welfare').table('rvd_signup').insert(req.body)
                                })
                        })
                        , check('emp').filter({ status: "sign" }).count().gt(0).branch(false,
                            r.db('welfare').table('rvd_signup').insert(req.body))
                    )
                )
            }
        })
        // .merge((get_insert) => {
        //     return get_insert('insert_status')
        // })
        // .merge((check_insert) => {
        //     return {
        //         insert_status: check_insert('inserted').gt(0)
        //     }
        // })
        .without('emp')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup').getAll(req.params.status, { index: 'status' })
        .eqJoin('personal_id', r.db('welfare').table('employee'), { index: 'personal_id' })
        .without({ right: ['id'] })
        .zip()
        .merge((date) => {
            return {
                date_signup: date('date_signup').split('T')(0)
            }
        })
        .eqJoin('rvd_id', r.db('welfare').table('rvd'))
        .pluck('left', { right: ['rvd_code', 'rvd_name'] })
        .zip()
        .merge((check_statue) => {
            return {
                status_thai: check_statue('status').eq('sign').branch('รอการยืนยัน',
                    check_statue('status').eq('active').branch('สมาชิก',
                        check_statue('status').eq('leave').branch('ลาออก', 'ออกจากกองทุน')
                    )
                )
            }
        })
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
        .orderBy('firstname')
        .run()

        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.listAll = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup')
        .eqJoin('personal_id', r.db('welfare').table('employee'), { index: 'personal_id' })
        .without({ right: ['id'] })
        .zip()
        .merge((date) => {
            return {
                date_signup: date('date_signup').split('T')(0)
            }
        })
        .eqJoin('rvd_id', r.db('welfare').table('rvd'))
        .pluck('left', { right: ['rvd_code', 'rvd_name'] })
        .zip()
        .merge((check_statue) => {
            return {
                status_thai: check_statue('status').eq('sign').branch('รอการยืนยัน',
                    check_statue('status').eq('active').branch('สมาชิก',
                        check_statue('status').eq('leave').branch('ลาออก', 
                        check_statue('status').eq('reject').branch('ไม่ผ่าน','ออกจากกองทุน'))
                    )
                )
            }
        })
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
        .orderBy('firstname')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.approve = function (req, res) {
    var r = req.r
    let now = new Date().toISOString()
    r.expr({})
        .merge((fund) => {
            return {
                rvd: r.db('welfare').table('rvd_signup').get(req.body.id)
                    .merge((ex) => {
                        return {
                            start_work_date: r.db('welfare').table('employee').getAll(ex('personal_id'), { index: 'personal_id' }).coerceTo('array')(0)
                                .getField('start_work_date')
                        }
                    })
                    .merge((start_work_date_stamp) => {
                        return {
                            check_date_work: r.ISO8601(start_work_date_stamp('start_work_date')).add(2592000).le(now).branch(
                                r.db('welfare').table('rvd_signup')
                                    .get(req.body.id)
                                    .update({
                                        date_approve: now,
                                        status: 'active'
                                    }),
                                r.db('welfare').table('rvd_signup')
                                    .get(req.body.id)
                                    .update({
                                        date_approve: start_work_date_stamp('start_work_date'),
                                        status: 'active'
                                    })
                            ),
                        }
                    })
            }
        })
        .merge((getF) => {
            return getF('rvd').getField('check_date_work')
        })
        .without('rvd')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.reject = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup').get(req.body.id)
        .update(
        { "status": "reject" }
        )
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.fundChange = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup')
        .get(req.body.id)
        .update(
        { "status": "change" }
        )
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.leave = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup')
        .get(req.body.id)
        .update(
        { "status": "leave" }
        )
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.fundOut = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup')
        .get(req.body.id)
        .update(
        { "status": "not" }
        )
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}