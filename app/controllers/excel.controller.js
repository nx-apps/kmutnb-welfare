sha1 = require('js-sha1');
exports.read = function (req, res) {
    //Read file here.
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/app/files/employee_update.xlsx');

    var file = workbook.Sheets;
    var data = {};
    var temp = { db: "", col: [], maxCol: "" };
    var keyIndex = 1; //num row has field_key
    var row = {};
    for (var sheet in file) {
        for (var key in file[sheet]) {
            if (key !== '!ref') {
                if (str2NumOnly(key) == keyIndex) {
                    temp.col[str2CharOnly(key)] = file[sheet][key].v;
                    temp.maxCol = str2CharOnly(key);
                } else {
                    if (temp.col[str2CharOnly(key)].indexOf("primary_id") > -1) {
                        row["id"] = sha1(file[sheet][key].v);
                    } else if (temp.col[str2CharOnly(key)].indexOf("date") > -1) {
                        console.log(file[sheet][key]);
                        // row[temp.col[str2CharOnly(key)]] = new Date(file[sheet][key].w).toISOString();
                        row[temp.col[str2CharOnly(key)]] = req.r.ISO8601(file[sheet][key].w + "T00:00:00+07:00");
                    } else if (temp.col[str2CharOnly(key)].indexOf("dob2") > -1) {
                        row[temp.col[str2CharOnly(key)]] = file[sheet][key].w;
                    } else {
                        row[temp.col[str2CharOnly(key)]] = file[sheet][key].v;
                    }

                    if (str2CharOnly(key) == temp.maxCol) {
                        data[temp.db].push(row);
                        row = {};
                    }
                }
            } else {
                temp.col = [];
                temp.db = sheet;
                if (!data.hasOwnProperty(sheet)) {
                    data[sheet] = [];
                }
            }
        }
    }



    var dataSheet = [];
    for (table in data) {
        dataSheet.push({ table: table, data: data[table] });
    }

    //res.json(dataSheet);
    var r = req.r;
    r.expr(dataSheet).forEach(function (row) {
        return r.db('welfare_data_emp').tableList().contains(row('table'))
            .do(function (tbExists) {
                return r.branch(tbExists,
                    r.db('welfare_data_emp').table(row('table')).delete(),
                    r.db('welfare_data_emp').tableCreate(row('table'))
                ).do(function (tbInsert) {
                    return r.db('welfare_data_emp').table(row('table')).insert(row('data'))
                })
            })
    })
        .run()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.status(500).json(err);
        })

}
function str2NumOnly(string) { //input AB123  => output 123
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 48) && (string[i].charCodeAt(0) <= 57)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode(t);
}
function str2CharOnly(string) { //input AB123  => output AB
    let t = [];
    for (let i = 0; i < string.length; i++) {
        if ((string[i].charCodeAt(0) >= 65) && (string[i].charCodeAt(0) <= 90)) {
            t.push(string[i].charCodeAt(0));
        }
    }
    return String.fromCharCode.apply(String, t);
}
exports.test = function (req, res) {

    // req.r.db('welfare_common').table('employee')
    //     .merge(function (m) {
    //         return r.db('welfare_common').table('department').getAll([m('faculty_name'), m('department_name')], { index: 'facDep' })
    //             .map(function (mm) {
    //                 return {
    //                     faculty_id: mm('faculty_id'),
    //                     department_id: mm('id')
    //                 }
    //             })(0)
    //     })
    //     .merge(function (m) {
    //         return {
    //             prefix_id: r.db('welfare_common').table('prefix').getAll(m('prefix_name'), { index: 'prefix_name' })(0).getField('id')
    //         }
    //     })
    //     .forEach(function (fe) {
    //         return r.db('welfare_common').table('employee').get(fe('id')).update(fe)
    //     })
    var d = new Date("2017-05-01T00:00:00+07:00").toISOString();
    req.r.expr([
        { name: 'a', d1: r.ISO8601(d) },
        { name: 'b', d1: r.ISO8601("2017-05-01T01:00:00.000Z").inTimezone("+07") },
        { name: 'c', d1: r.ISO8601("2017-05-01T17:00:00.000Z").inTimezone("+07") }
    ])
        /*.filter(function (f) {
            return f('d1').date().during(
                r.ISO8601("2017-05-01T00:00:00.000Z").inTimezone("+07").date(),
                r.ISO8601("2017-05-02T00:00:00.000Z").inTimezone("+07").date(),
                { rightBound: "closed" }
            )
        })*/
        .merge(function (m) {
            return {
                d2: m('d1').inTimezone("+07").toISO8601()
            }
        })
        .run()
        .then(function (data) {
            res.json(data);
        })
}

exports.getFieldCommonDataFromEmployee = function (req, res) {
    var r = req.r;
    r.db('welfare_data_emp').tableList()
        .filter(function (f) {
            return f.ne('employee')
        })
        .map(function (m) {
            return r.db('welfare_data_emp').table(m)(0).keys()
        })
        .reduce(function (l, r) {
            return l.add(r)
        })
        .distinct()
        .run()
        .then(function (data) {
            res.json(data);
        })
}
exports.insertCommonDataFromEmployee = function (req, res) {
    var r = req.r;
    r.db('welfare_data_emp').tableList()
        .filter(function (f) {
            return f.ne('employee')
        })
        .map(function (m) {
            return r.db('welfare_data_emp').table(m)
                .getField('type_employee_name') //gender_name,matier_name,position_name,type_employee_name
                .coerceTo('array')
        })
        .reduce(function (l, r) {
            return l.add(r)
        })
        .distinct()
        .forEach(function (fe) {
            return r.db('welfare_common')
                .table('type_employee') //gender,matier,position,type_employee
                .insert({ type_employee_name: fe }) //gender_name,matier_name,position_name,type_employee_name
            //.insert({type_employee_name:''}) //for empty
        })
        .run()
        .then(function (data) {
            res.json(data);
        })
}
exports.mergeDataToEmployee = function (req, res) {
    var r = req.r;
    r.db('welfare_data_emp').tableList()
        .filter(function (f) {
            return f.ne('employee')
        })
        .forEach(function (fe) {
            return r.db('welfare_data_emp').table(fe).without('id').forEach(function (fe2) {
                return r.db('welfare_data_emp').table('employee').getAll(fe2('personal_id'), { index: 'personal_id' }).update(fe2)
            })
        })
        .run()
        .then(function (data) {
            res.json(data);
        })
}
exports.mergeDataBlankToEmployee = function (req, res) {
    var r = req.r;
    r.db('welfare_data_emp').table('employee')
        .filter(function (f) {
            return f.hasFields('type_employee_name') //gender_name,matier_name,position_name,type_employee_name
                .eq(false)
        }).update({ type_employee_name: '' }) //gender_name,matier_name,position_name,type_employee_name
        .run()
        .then(function (data) {
            res.json(data);
        })
}
exports.mergeIdDataToEmployee = function (req, res) {
    var r = req.r;

    r.expr([
        { tbname: 'gender', pid: 'gender_id', pname: 'gender_name' },
        { tbname: 'matier', pid: 'matier_id', pname: 'matier_name' },
        { tbname: 'position', pid: 'position_id', pname: 'position_name' },
        { tbname: 'type_employee', pid: 'type_employee_id', pname: 'type_employee_name' }
    ])
        .forEach(function (fe) {
            return r.db('welfare_common').table(fe('tbname')).merge(function (merge_data) {
                return r.expr([[fe('pid'), merge_data('id')]]).coerceTo("OBJECT")
            }).without('id')
                .forEach(function (fe2) {
                    return r.db('welfare_data_emp').table('employee').getAll(fe2(fe('pname')), { index: fe('pname') }).update(fe2)
                })
        })
        .run()
        .then(function (data) {
            res.json(data);
        })
}