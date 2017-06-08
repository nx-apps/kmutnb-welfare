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
exports.wel2emp = function (req, res) {
    var checkLogic = function (select, row) {
        return r.branch(
            select('logic').eq('=='),
            row(select('field_name')).eq(select('value')),
            select('logic').eq('>'),
            row(select('field_name')).gt(select('value')),
            select('logic').eq('>='),
            row(select('field_name')).ge(select('value')),
            select('logic').eq('<'),
            row(select('field_name')).lt(select('value')),
            select('logic').eq('<='),
            row(select('field_name')).le(select('value')),
            row(select('field_name')).ne(select('value'))
        )
    };

    req.r.expr({
        employees: r.db('welfare').table('employee').limit(20).coerceTo('array'),
        welfare: []
    })
        .merge(function (m) {
            return {
                welfare: r.db('welfare').table('welfare')
                    .merge(function (m2) {
                        var countCon = m2('condition').count();
                        var emp_budget = r.branch(countCon.eq(0),
                            [m('employees').pluck('id')],
                            m2('condition').map(function (con_map) {
                                return m('employees').filter(function (f) {
                                    return checkLogic(con_map, f)
                                })
                                    .coerceTo('array').pluck('id')
                            })
                        ).reduce(function (l, r) {
                            return l.add(r)
                        })
                            .group('id').count().ungroup()
                            .filter(function (emp_filter) {
                                return r.branch(countCon.eq(0),
                                    emp_filter('reduction').eq(countCon.add(1)),
                                    emp_filter('reduction').eq(countCon)
                                )
                            }).count();
                        return {
                            countCon: countCon,
                            employee: emp_budget,
                            value_budget: r.branch(m2('round_use').eq(true), emp_budget.mul(m2('budget')), 0)
                        }
                    }).coerceTo('array')
            }
        })
        .without('employees')
        .run()
        .then(function (data) {
            res.json(data);
        })
}
exports.emp2wel = function (req, res) {
    var checkLogic = function (con, me) {
        return r.branch(
            con('logic').eq('=='),
            me(con('field_name')).eq(con('value')),
            con('logic').eq('>'),
            me(con('field_name')).gt(con('value')),
            con('logic').eq('>='),
            me(con('field_name')).ge(con('value')),
            con('logic').eq('<'),
            me(con('field_name')).lt(con('value')),
            con('logic').eq('<='),
            me(con('field_name')).le(con('value')),
            me(con('field_name')).ne(con('value'))
        )
    };
    req.r.db('welfare').table('employee').get('000183c1-23db-4af2-937f-3e359400e33c')
        .merge(function (me) {
            return {
                group: r.db('welfare').table('welfare')
                    .getAll(2017, 9999, { index: 'year' })
                    .merge(function (m2) {
                        var countCon = m2('condition').count();
                        var countProp = r.branch(countCon.eq(0),
                            [{ prop: true }],
                            m2('condition').map(function (con) {
                                return { prop: checkLogic(con, me) }
                            }).coerceTo('array')
                        ).filter({ prop: true }).count()
                        return {
                            countCon: countCon,
                            countProp: countProp
                        }
                    })
                    .filter(function (f) {
                        return f('countCon').eq(f('countProp'))
                    })
                    .group('group_id').ungroup()
                    .without('reduction')
                    .eqJoin('group', r.db('welfare').table('group_welfare')).pluck("left", { right: 'group_welfare_name' }).zip()
                    .coerceTo('array')
            }
        })
        .pluck('id', 'firstname', 'group')
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
exports.write = function (req, res) {
    req.r.db('welfare').table('employee')
        .limit(10)
        // .without('id')
        // .merge({ a_1: 'xx' })
        // .group('faculty_name').ungroup()
        .run().then(function (data) {
            // res.json(data);
            const XLSX = require('xlsx');
            /* create workbook & set props*/
            const wb = { SheetNames: [], Sheets: {} };
            // // wb.Props = {
            // //     Title: "Stats from app",
            // //     Author: "John Doe"
            // // };
            // /*create sheet data & add to workbook*/
            // for (var prop in data) {
            // var ws = XLSX.utils.json_to_sheet(data[prop]['reduction']);
            // var ws_name = data[prop]['group'].substring(0, 30);
            // XLSX.utils.book_append_sheet(wb, ws, ws_name);
            // }
            // /* create file 'in memory' */
            var ws = XLSX.utils.json_to_sheet(data);
            res.json(ws);
            var ws_name = 'test';
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            var filename = "employee.xlsx";
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            res.type('application/octet-stream');
            res.send(wbout);
        })

}
exports.reduce = function (req, res) {
    req.r.expr({
        emps: r.db('welfare').table('employee').coerceTo('array'),
        welfare: []
    })
        .merge(function (m) {
            var emps = m('emps');
            return {
                welfare: r.db('welfare').table('welfare')
                    // .filter(function (f) {
                    //     return f('condition').count().gt(1)
                    // })
                    // .limit(15)
                    .merge(function (m2) {
                        var condition = m2('condition');
                        return {
                            countCon: condition.count(),
                            reduce: reduceCondition(emps, condition).count(),
                            // old: condition.map(function (con_map) {
                            //     return emps.filter(function (f) {
                            //         return checkLogic(con_map, f)
                            //     }).coerceTo('array').pluck('id')
                            // })
                            // .reduce(function (left, right) {
                            //     return left.add(right)
                            // })
                            // .group('id').count().ungroup()
                            // .filter(function (emp_filter) {
                            //     return r.branch(condition.count().eq(0),
                            //         emp_filter('reduction').eq(condition.count().add(1)),
                            //         emp_filter('reduction').eq(condition.count())
                            //     )
                            // }).count()
                        }
                    })
                    .coerceTo('array')
            }
        })
        .getField('welfare')
        .run()
        .then(function (data) {
            res.json(data)
        })

}
var checkLogic = function (select, row) {
    return r.branch(
        select('logic').eq('=='),
        row(select('field_name')).eq(select('value')),
        select('logic').eq('>'),
        row(select('field_name')).gt(select('value')),
        select('logic').eq('>='),
        row(select('field_name')).ge(select('value')),
        select('logic').eq('<'),
        row(select('field_name')).lt(select('value')),
        select('logic').eq('<='),
        row(select('field_name')).le(select('value')),
        row(select('field_name')).ne(select('value'))
    )
};
var reduceCondition = function (emp, con) {
    var countCon = con.count();
    return r.branch(countCon.gt(1),
        con.reduce(function (left, right) {
            return r.branch(left.hasFields('data'),
                {
                    data: left('data').filter(function (f) {
                        return checkLogic(right, f)
                    })
                },
                {
                    data: emp.filter(function (f) {
                        return checkLogic(left, f)
                    }).filter(function (f) {
                        return checkLogic(right, f)
                    }).coerceTo('array')
                }
            )
        })('data'),
        countCon.eq(1),
        emp.filter(function (f) {
            return checkLogic(con(0), f)
        }),
        emp
    )
}