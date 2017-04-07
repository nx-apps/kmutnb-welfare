exports.day = (req, res) => {
    r.db('welfare').table('history_welfare').filter(function (row) {
        return row('date_use').split('T')(0).eq(req.query.date_start)
    }).filter({ status: 'approve' })
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
    let result = 1
    let date_start = +new Date(req.query.date_start)
    let date_end = +new Date(req.query.date_end)
    let day = 1000*60*60*24;
    // +1 เพราะได้แค่น้อยกว่าวันที่ต้องการ 1 วัน
    let conuntDay = ((date_end-date_start)/day)+1  
    let date = []
    console.log(new Date(date_start).getDay())
    for (var i = 0; i < conuntDay; i++) {
        date.push(new Date(new Date().setDate(new Date(date_start).getDay() + i)))
    }
    console.log(conuntDay);
    console.log(date);

    r.expr(result)
        .run()
        .then(function (result) {
            // if(result.length <1){
            //     result.push({
            //         id:req.query.date_start,
            //         bath:0
            //     })
            // }
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.month = (req, res) => {
    let result = 1
    res.json(result);
}
exports.year = (req, res) => {
    let result = 1
    res.json(result);
}