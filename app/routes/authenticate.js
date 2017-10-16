const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../../config/secret')

module.exports = function (options) {
    options = options || ["*"];
    return function authenticate(req, res, next) {
        // console.log(req.headers.token)

        if (req.headers.token) {
            jwt.verify(req.headers.token, SECRET_KEY, function (err, decode) {

                if (err) {
                    res.status(401).send("Unauthorized")
                } else {
                    req.user = decode;
                    next()
                    // const r = req.r;

                    // r.db('lms').table('user').get(decode.id)
                    //     .do(function (user) {
                    //         return r.branch(
                    //             user.eq(null).not(),
                    //             user,
                    //             r.error('0')
                    //         )
                    //     })
                    //     .do(function (user) {
                    //         return r.branch(
                    //             user('active').eq(true),
                    //             user,
                    //             r.error('1')
                    //         )
                    //     })

                    //     .merge(function (row) {
                    //         return {
                    //             role: r.branch(row('admin').eq(true), 'admin',
                    //                 r.branch(row('key_tags').count().eq(0), 'end', 'key')
                    //             )
                    //         }
                    //     })
                    //     .merge(function (data) {
                    //         return {
                    //             page: r.expr(roleList).filter(function (row) {
                    //                 return r.branch(
                    //                     row.hasFields('role').not(), true,
                    //                     r.branch(
                    //                         row('role').contains('*'), true,
                    //                         r.branch(
                    //                             row('role').contains(data('role')), true, false
                    //                         )
                    //                     )
                    //                 )
                    //             }).map(function (row) {
                    //                 return row('page')
                    //             })
                    //         }

                    //     })

                    //     .pluck('username', 'email', 'emp_id', 'name', 'id', 'role', 'end_tags', 'key_tags', 'status', 'page','id_card')

                    //     .run()
                    //     .then((result) => {
                    //         //res.json(result)
                    //         if (options.includes("*") || options.includes(result.role)) {
                    //             req.user = result;
                    //             next();
                    //         } else {
                    //             res.status(403).send("Access Denied");
                    //         }

                    //     })
                    //     .catch((err) => {
                    //         if (err.msg == '0') {
                    //             err.msg = 'ชื่อผู้ใช้งานไม่มีอยู่แล้ว'

                    //         } else if (err.msg == '1') {
                    //             err.msg = 'ชื่อผู้ใช้ถูกระงับ'

                    //         }
                    //         res.status(500).json(err);

                    //     })
                }
            });
        } else {
            res.status(401).send("Unauthorized");
        }
    }

}
