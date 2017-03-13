exports.faculty = function (req, res) {
    var r = req.r;
    r.db('welfare_common').table('faculty')
        .merge(function (m) {
            return {
                department: r.db('welfare_common').table('department').getAll(m('id'), { index: 'faculty_id' })
                    .coerceTo('array')
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
exports.facultyInsert = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('faculty', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {
        r.db('welfare_common').table('faculty')
            .insert(req.body)
            .run()
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.status(500).json(err);
            })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.facultyUpdate = function (req, res) {
    var r = req.r;
    var valid = req.ajv.validate('faculty', req.body);
    var result = { result: false, message: null, id: null };
    if (valid) {

        r.db('welfare_common').table('faculty')
            .get(req.body.id)
            .update(req.body)
            .run()
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.status(500).json(err);
            })
    } else {
        result.message = req.ajv.errorsText()
        res.json(result);
    }
}
exports.facultyDelete = function (req, res) {
    //   console.log(req.body)
    var r = req.r;
    r.db('welfare_common').table('faculty')
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