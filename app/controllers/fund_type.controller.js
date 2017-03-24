exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('fund_type')
        .merge(function (m) {
            return {
                date_create: m('date_create').split('T')(0),
                date_update: m('date_update').split('T')(0),
                emp_type: m('emp_type').merge(function (emp_merge) {
                    return r.db('welfare_common').table('type_employee').get(emp_merge('emp_type_id')).without('id')
                    
                })
            }
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.insert = function (req, res) {
    var r = req.r
    var valid = req.ajv.validate('fund_type', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body,
            {
                date_create: new Date().toISOString(),
                date_update: new Date().toISOString()
            }
        );
        r.db('welfare').table('fund_type').insert(req.body)
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
    }
    else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.update = function (req, res) {
    var r = req.r;
    req.body = Object.assign(req.body,
        {
            date_update: new Date().toISOString()
        }
    );
    r.db('welfare').table('fund_type')
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
    r.db('welfare').table('fund_type')
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