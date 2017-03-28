exports.getrvd = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd_signup').getAll(req.params.pid, { index: 'personal_id' })
        .eqJoin('rvd_id', r.db('welfare').table('rvd'))
        .without({ right: ['id', 'status'] })
        .zip()
        .merge((date) => {
            return {
                date_signup: date('date_signup').split('T')(0)
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
exports.signup = function (req, res) {
    var r = req.r
    let data = {
        date_signup: new Date().toISOString(),
        status: 'sign'
    }
    Object.assign(req.body, data)

    console.log(req.body);
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
                        , r.db('welfare').table('rvd_signup').insert(req.body))
                )
            }
        })
        .merge((get_insert)=>{
           return  get_insert('insert_status')
        })
        .merge((check_insert)=>{
            return {
                insert_status: check_insert('inserted').gt(0)
            }
        })
        .without('emp')
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
