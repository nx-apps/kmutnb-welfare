exports.list = function (req, res) {
    var r = req.r;
    var time = r.ISO8601(req.query.date+'T00:00:00+07:00');
    var calculateAge = function (birthday) { // birthday is a date
        // var ageDifMs = r.now().toEpochTime().sub(birthday.toEpochTime())
        var ageDifMs = time.toEpochTime().sub(birthday.toEpochTime())
        var ageDate = r.epochTime(ageDifMs); // miliseconds from epoch
        //  return Math.abs(ageDate.year() - 1970);
        return ageDate.year().sub(1970)
    }
    r.db('welfare').table('employee').getAll(r.db('welfare').table('system_config')(0)('active_id'), { index: 'active_id' })
        .merge(function (use) {
            return {
                birthdate_cal: calculateAge(use('birthdate')),
                start_work_date_cal: calculateAge(use('start_work_date')),
                birthdate: use('birthdate').toISO8601().split('T')(0),
                start_work_date: use('start_work_date').toISO8601().split('T')(0),
            }
        })
        .filter(function (f) {
            return f('birthdate_cal').gt(60)
        })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}