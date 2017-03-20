exports.date = function(req,res){

    // console.log(new Date().toISOString().split('T')[0]);
    let now_Date = {now_date :new Date().toISOString().split('T')[0]}
    res.json(now_Date);
//   var r = req.r;
//     r.db('welfare_common').table('academic')
//         .run()
//         .then(function (result) {
//             res.json(result);
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
}