exports.list = function (req, res) {
    var r = req.r;
    var time = r.ISO8601(req.query.date + 'T00:00:00+07:00');
    var calculateAge = function (birthday) { // birthday is a date
        // var ageDifMs = r.now().toEpochTime().sub(birthday.toEpochTime())
        var ageDifMs = time.toEpochTime().sub(birthday.toEpochTime())
        var ageDate = r.epochTime(ageDifMs); // miliseconds from epoch
        //  return Math.abs(ageDate.year() - 1970);
        return ageDate.year().sub(1970)
    }
    r.db('welfare').table('employee').getAll('WORK', { index: 'active_id' })
        .merge(function (use) {
            return {
                birthdate_cal: calculateAge(use('birthdate')),
                start_work_date_cal: calculateAge(use('start_work_date')),
                birthdate: use('birthdate').toISO8601().split('T')(0),
                start_work_date: use('start_work_date').toISO8601().split('T')(0),
            }
        })
        .filter(function (f) {
            return f('birthdate_cal').eq(60)
        })
        .pluck(['id', 'personal_id', 'birthdate', 'birthdate_cal', 'prefix_name', 'firstname', 'lastname',
            'type_employee_name', 'start_work_date', 'start_work_date_cal'])
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}
exports.updateRetier = function (req, res) {
    var r = req.r;
    // console.log(req.body)
    // req.body = Object.assign(req.body, { year: req.body.year - 543 });
    // for (let prop in req.body) {
    //     req.body[prop] = req.body[prop].replace(/ /g, '').trim()

    // }
    function getAge(end_work_date, birthday) {
        var end_work_date = new Date(end_work_date)
        var birthDate = new Date(birthday)
        // console.log(end_work_date, birthDate);
        var age = end_work_date.getFullYear() - birthDate.getFullYear();
        var m = end_work_date.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && end_work_date.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    // 2017-06-01T00:00:00.000+07:00
    req.body.map(emp => {
        let start_work_date = emp.start_work_date + 'T00:00:00+07:00',
            end_work_date = emp.end_work_date + 'T00:00:00+07:00',
            birthdate = emp.birthdate + 'T00:00:00+07:00'
        // console.log(emp.birthdate+ 'T00:00:00+07:00', '111');
        if (end_work_date !== null && end_work_date !== undefined && end_work_date !== '') {
            // console.log(end_work_date.split('T')[0], birthdate.split('T')[0]);

            emp.age = getAge(end_work_date.split('T')[0], birthdate.split('T')[0])
            emp.work_age = getAge(end_work_date.split('T')[0], start_work_date.split('T')[0])
            emp.end_work_date = r.ISO8601(emp.end_work_date + 'T00:00:00+07:00')
        } else {
            emp.age = 0
            emp.work_age = 0
            emp.end_work_date = null
        }
        console.log(emp.start_work_date);
        // emp.start_work_date = r.ISO8601(emp.start_work_date+ 'T00:00:00+07:00')
        // emp.birthdate = r.ISO8601(emp.birthdate+ 'T00:00:00+07:00')
        delete emp.start_work_date
        delete emp.birthdate
        delete emp.check
        delete emp.firstname
        delete emp.lastname
        delete emp.personal_id
        delete emp.prefix_name
        delete emp.start_work_date
        delete emp.type_employee_name
        return emp
    })

    // console.log();
    // console.log(req.body);
    r.expr(req.body)
        .forEach(e => {
            return r.db('welfare').table('employee').get(e('id')).update(e)
        })
        // r.db('welfare').table('employee')
        // .get(req.body.id)
        // .update(req.body)
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })
}