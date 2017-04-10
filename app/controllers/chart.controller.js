exports.day = (req, res) => {
    //  ดูเงินที่ใช้รายวัน อย่างเดียว
    let group_id = req.query.group_id
    r.db('welfare').table('history_welfare').filter(function (row) {
        return row('date_use').split('T')(0).eq(req.query.date_start)
    }).filter({ status: 'approve', group_id: group_id })
        .orderBy(r.asc('date_use'))
        .merge((date) => {
            return {
                date_approve: date('date_approve').split('T')(0),
                date_use: date('date_use').split('T')(0)
            }
        })
        .group('date_approve')
        .ungroup()
        .merge((total) => {
            return {
                id: total('group'),
                bath: total('reduction').sum('use_budget')
            }
        })
        .without('reduction', 'group')
        .run()
        .then(function (result) {
            if (result.length < 1) {
                result.push({
                    id: req.query.date_start,
                    bath: 0
                })
            }
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
    // console.log(typeof xxxx);
    let year = 2017
    console.log(tomorrow.toISOString().split('T')[0]);
    for (var i = 0; i < conuntDay; i++) {
        if (i == 0) {
            date.push({ id: new Date(tomorrow.setDate(tomorrow.getDate() + 0)).toISOString().split('T')[0] })
        }
        date.push({ id: new Date(tomorrow.setDate(tomorrow.getDate() + 1)).toISOString().split('T')[0] })
    }
    // console.log(tomorrow);
    // console.log(date);
    // r.db('welfare').table('history_welfare')
    //     .between(req.query.date_start, req.query.date_end, { index: 'date_approve' })
    //     .filter({ status: 'approve' })
    //     .orderBy(r.asc('date_use'))
    //     .merge((date) => {
    //         return {
    //             date_approve: date('date_approve').split('T')(0),
    //             date_use: date('date_use').split('T')(0)
    //         }
    //     })
    //     .merge((day)=>{
    //         return {
    //             day : date
    //         }
    //     })
    //     .getField('day')
    let group_id = req.query.group_id
    r.expr({
        date: date,
        emp: r.db('welfare').table('group_welfare').getAll(year, { index: 'year' })
            .filter({ status_approve: true, group_id: group_id })
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
                        conditions: el('conditions').merge((merge2) => {
                            return {
                                countCon: merge2('condition').count(),
                                //1 เช็คว่า เงือนไขมีไหมมีก็ไปต่อ ไม่มีก็ส่งสมาชิกกลับไปทุกคน
                                employee_new: merge2('condition').count().eq(0).branch(
                                    merge2('employees'),
                                    merge2('condition').map((con_map) => {
                                        return merge2('employees').filter((f) => {
                                            return f(con_map('field')).do((d) => {
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
                        })//
                           
                        // ss: el('conditions').
                    }
                })//r.branch(getDate('condition').count().eq(0)

            }
        })
        .without('date_start', 'date_end')
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
    r.db('welfare').table('group_welfare').getAll(req.query.year, { index: 'year' })
        .filter({ status_approve: true })
        .merge((getHis) => {
            return {
                bath: r.db('welfare').table('history_welfare')
                    .between(date_start, date_end, { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({ status: 'approve', group_id: getHis('id') })
                    .orderBy(r.asc('date_use'))
                    .sum('use_budget')
            }
        })
        .merge((name) => {
            return {
                id: name('group_welfare_name')
            }
        })
        .without('group_welfare_name', 'year', 'description', 'admin_use', 'end_date', 'onetime', 'start_date', 'status_approve')
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
    let data = []
    for (var i = 1; i <= 12; i++) {
        if (i < 10)
            i = '0' + i

        data.push({
            id: String(i),
            date_start: year + "-" + i + "-" + '01' + 'T00:00:0:000Z',
            date_end: year + "-" + i + "-" + new Date(2017, i, 0).getDate() + 'T23:59:59:999Z',
        })
    }
    let result = 1
    let group_id = req.query.group_id
    r.expr(data)
        .merge((getData) => {
            return {
                bath: r.db('welfare').table('history_welfare')
                    .between(getData('date_start'), getData('date_end'), { index: 'date_approve' })
                    .coerceTo('array')
                    .filter({
                        status: 'approve',
                        group_id: group_id
                    })
                    .orderBy(r.asc('date_use'))
                    .sum('use_budget')
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