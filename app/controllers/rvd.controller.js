exports.list = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd')
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.listId = function (req, res) {
    var r = req.r
    r.db('welfare').table('rvd').get(req.params.id)
        .run()
        .then(function (result) {
            res.json(result);
        })
}
exports.insert = function (req, res) {
    var r = req.r
    var valid = req.ajv.validate('rvd', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        req.body = Object.assign(req.body,
            {
                date_create: new Date().toISOString(),
                date_update: new Date().toISOString()
            }
        );
        r.db('welfare').table('rvd').insert(req.body)
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
    r.db('welfare').table('rvd')
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
    r.db('welfare').table('rvd')
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