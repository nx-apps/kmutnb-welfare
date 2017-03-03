exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
    .merge(function(m){
        return {
            start_date : m('start_date').split('T')(0),
            end_date : m('end_date').split('T')(0)
        }
    })
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.listId = function (req, res) {
    var r = req.r
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .merge(function (wel_merge) {
            return {
                employees: r.db('welfare').table('employee').coerceTo('array')
            }
        })
        .merge(function (wel_merge) {
            return {
                countCon: wel_merge('condition').count(),
                employee1: wel_merge('condition').map(function (con_map) {
                    return wel_merge('employees').filter(function (f) {
                        return f(con_map('field')).do(function (d) {
                            return r.branch(con_map('logic').eq(">="),
                                d.ge(con_map('value')),
                                r.branch(con_map('logic').eq(">"),
                                    d.gt(con_map('value')),
                                    r.branch(con_map('logic').eq("<="),
                                        d.le(con_map('value')),
                                        r.branch(con_map('logic').eq("<"),
                                            d.lt(con_map('value')),
                                            r.branch(con_map('logic').eq("="),
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
            }
        })
        .merge(function (wel_merge) {
            return {
                employee2: wel_merge('employee1').reduce(function (l, r) {
                    return l.add(r)
                })
            }
        })
        .merge(function (wel_merge) {
            return {
                employee3: wel_merge('employee2').merge(function (emp2_merge) {
                    return {
                        count: wel_merge('employee2').filter(function (f) {
                            return f('id').eq(emp2_merge('id'))
                        }).count()
                    }
                })
            }
        })
        .merge(function (wel_merge) {
            return {
                employee: wel_merge('employee3')
                    .filter({ count: wel_merge('countCon') })
                    .coerceTo('array')
                    .distinct()
                    .without('count')
            }
        })
        .without('employees', 'employee1', 'employee2', 'employee3', 'countCon')
        .run()
        .then(function (result) {
            res.json(result)
        })
        .catch(function (err) {
            res.status(500).json(err)
        })
}
exports.insert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('welfare', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body, { year: req.body.year - 543 });
        r.db('welfare').table('welfare').insert(req.body)
            .run()
            .then((response) => {
                result.message = response;
                if (response.errors == 0) {
                    result.result = true;
                    result.id = response.generated_keys;
                }
                res.json(result);
            })
            .error((err) => {
                result.message = err;
                res.json(result);
            })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.update = function (req, res) {
    var r = req.r;
    // console.log(req.body)
    req.body = Object.assign(req.body, { year: req.body.year - 543 });
    r.db('welfare').table('welfare')
        .get(req.body.id)
        .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.delete = function (req, res) {
    var r = req.r;
    r.db('welfare').table('welfare')
        .get(req.params.id)
        .delete()
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}