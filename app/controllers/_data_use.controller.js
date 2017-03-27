exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.test = function (req, res) {
    var r = req.r
    r.expr({
        welfare: r.db('welfare').table('welfare').coerceTo('array'),
        employee: r.db('welfare').table('employee')
            // .eqJoin('academic_id', r.db('welfare').table('academic')).without({ right: 'id' }).zip()
            // .eqJoin('active_id', r.db('welfare').table('active')).without({ right: 'id' }).zip()
            // .eqJoin('department_id', r.db('welfare').table('department')).without({ right: 'id' }).zip()
            // .eqJoin('faculty_id', r.db('welfare').table('faculty')).without({ right: 'id' }).zip()
            // .eqJoin('gender_id', r.db('welfare').table('gender')).without({ right: 'id' }).zip()
            // .eqJoin('matier_id', r.db('welfare').table('matier')).without({ right: 'id' }).zip()
            // .eqJoin('position_id', r.db('welfare').table('position')).without({ right: 'id' }).zip()
            // .eqJoin('prefixname_id', r.db('welfare').table('prefixname')).without({ right: 'id' }).zip()
            // .eqJoin('type_employee_id', r.db('welfare').table('type_employee')).without({ right: 'id' }).zip()
            .coerceTo('array')
            // .merge(function (emp_merge) {
            //     return {
            //         welfare: r.db('welfare').table('welfare').coerceTo('array')
                    // .merge(function (wel_merge) {
                    //     return {
                    //         conCount: wel_merge('condition').count(),
                    //         conPass: wel_merge('condition').map(function (con_map) {
                    //             return {
                    //                 pass: emp_merge(con_map('field')).do(function (d) {
                    //                     return r.branch(con_map('logic').eq(">="),
                    //                         d.ge(con_map('value')),
                    //                         r.branch(con_map('logic').eq(">"),
                    //                             d.gt(con_map('value')),
                    //                             r.branch(con_map('logic').eq("<="),
                    //                                 d.le(con_map('value')),
                    //                                 r.branch(con_map('logic').eq("<"),
                    //                                     d.lt(con_map('value')),
                    //                                     r.branch(con_map('logic').eq("="),
                    //                                         d.eq(con_map('value')),
                    //                                         d.ne(con_map('value'))
                    //                                     )
                    //                                 )
                    //                             )
                    //                         )
                    //                     )
                    //                 })
                    //             }
                    //         })
                    //     }
                    // })
                    //             .merge(function (wel_merge) {
                    //                 return {
                    //                     conCountPass: wel_merge('conPass').filter({ pass: true }).count()
                    //                 }
                    //             })
                    //             .merge(function (wel_merge) {
                    //                 return {
                    //                     conStatus: wel_merge('conCountPass').eq(wel_merge('conCount'))
                    //                 }
                    //             })
                    //             .filter(function (f) {
                    //                 return f('conStatus').eq(true)
                    //             })
                    //             //.without('conCount', 'conCountPass', 'conPass', 'conStatus')
                    //             .pluck('name')
                    //             .coerceTo('array')
                // }
            // })
        // .without('id')
        // .orderBy('name')
    })
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
// exports.Id = function (req, res) {
//     var r = req.r
//     r.db('welfare').table('welfare')
//         .get(req.params.id)
//         .merge(function (m) {
//             return {
//                 count_con: m('condition').count(),
//                 employees: m('condition').map(function (mmm) {
//                     return r.db('welfare').table('employee')
//                         .filter(function (emp_filter) {
//                             return emp_filter(mmm('field')).do(function (d) {
//                                 return r.branch(mmm('logic').eq('>'),
//                                     d.gt(mmm('value')),
//                                     r.branch(mmm('logic').eq('>='),
//                                         d.ge(mmm('value')),
//                                         r.branch(mmm('logic').eq('<'),
//                                             d.lt(mmm('value')),
//                                             r.branch(mmm('logic').eq('<='),
//                                                 d.le(mmm('value')),
//                                                 r.branch(mmm('logic').eq('='),
//                                                     d.eq(mmm('value')),
//                                                     d.ne(mmm('value'))
//                                                 )
//                                             )
//                                         )
//                                     )
//                                 )
//                             })
//                         })
//                         .coerceTo('array')
//                         .merge({ count_emp: m('name').and(m('id')).count() })
//                 })
//                     .reduce(function (left, right) {
//                         return left.add(right)
//                     })
//                 // .distinct()
//             }
//         })
//         .run()
//         .then(function (result) {
//             res.json(result)
//         })
//         .catch(function (err) {
//             res.status(500).json(err);
//         })
// }