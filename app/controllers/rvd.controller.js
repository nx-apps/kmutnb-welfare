exports.genFund = function (req, res) {
    var r = req.r
    r.db('welfare').table('employee')
        .getAll('WORK', { index: "active_id" })
        .pluck('personal_id', 'prefix_name', 'firstname', 'lastname')
        .merge((name) => {
            return {
                FUND01_personal_id: name('personal_id'),
                FUND02_emp_name: name('prefix_name').add(name('firstname'))
                    .add('  ', name('lastname')),
                FUND03_fund_name: '',
                FUND04_fund_uname: '',
                FUND05_fund_company: '',
                FUND06_fund_month: '',
                FUND07_fund_year: '',
                FUND08_fund_date: '',
                FUND09_policy_code: '',
                FUND10_policy_name: '',
                FUND11_emp_con: '',
                FUND12_emp_ear: '',
                FUND13_com_con: '',
                FUND14_com_ear: '',
                FUND15_total: '',
            }
        })
        .without('firstname', 'lastname', 'prefix_name', 'personal_id')
        .run()
        .then(function (data) {
            // res.json(data);
            const XLSX = require('xlsx');
            const wb = { SheetNames: [], Sheets: {} };
            // // // wb.Props = {
            // // //     Title: "Stats from app",
            // // //     Author: "John Doe"
            // // // };
            // // /*create sheet data & add to workbook*/
            // for (var prop in data) {
            var ws = XLSX.utils.json_to_sheet(data);
            var ws_name = 'genfund'
            XLSX.utils.book_append_sheet(wb, ws, ws_name);
            // }
            // // // /* create file 'in memory' */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            var filename = "FUND.xlsx";
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            res.type('application/octet-stream');
            res.send(wbout);
        })
}
exports.downloadfund = function (req, res) {
    //Read file here.
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile('../kmutnb-welfare/app/files/genfund.xlsx');

    var file = workbook.Sheets;
    // var sheets = [];
    // for(var sheet in file){
    //     sheets.push(sheet);
    // }
    // res.json(file);
    var sheetname = "FUND";
    var rowNo = 2;
    var datas = [];
    var faculty_name = "";
    while (typeof file[sheetname]['A' + rowNo] !== "undefined") {
        var data = {
            personal_id: file[sheetname]['A' + rowNo].v,
            emp_name: file[sheetname]['B' + rowNo].v,
            fund_name: file[sheetname]['C' + rowNo].v,
            fund_uname: file[sheetname]['D' + rowNo].v,
            fund_company: file[sheetname]['E' + rowNo].v,
            fund_month: file[sheetname]['F' + rowNo].v,
            fund_year: file[sheetname]['G' + rowNo].v,
            fund_date: file[sheetname]['H' + rowNo].v,
            policy_code: file[sheetname]['H' + rowNo].v,
            policy_name: file[sheetname]['H' + rowNo].v,
            emp_con: file[sheetname]['H' + rowNo].v,
            emp_ear: file[sheetname]['H' + rowNo].v,
            com_con: file[sheetname]['H' + rowNo].v,
            com_ear: file[sheetname]['H' + rowNo].v,
            total: file[sheetname]['H' + rowNo].v
        };
        datas.push(data);
        rowNo += 1;
    }
    res.json(datas)
  
    // res.json(datas[0]);
    // r.expr(datas)
    //     .run()
    //     .then(function (result) {
    //         res.json(result)
    //     })
    // r.db('welfare').table('history_sso').insert(datas)
    // .run()
    // .then(function (result) {
    //     res.json(result);
    // })

}
