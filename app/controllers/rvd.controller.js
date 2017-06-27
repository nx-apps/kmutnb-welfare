exports.genFund = function (req, res) {
    var r = req.r
    r.db('welfare').table('employee').getAll('WORK', { index: "active_id" })
        .pluck('personal_id', 'prefix_name', 'firstname', 'lastname')
        .merge((name) => {
            return {
                A_personal_id: name('personal_id'),
                B_emp_name: name('prefix_name').add(name('firstname'))
                    .add('  ', name('lastname')),
                C_fund_name: '',
                D_fund_uname: '',
                E_fund_company: '',
                F_fund_month: '',
                G_fund_year: '',
                H_fund_date: '',
                I_policy_code: '',
                J_policy_name: '',
                K_emp_con: '',
                L_emp_ear: '',
                M_com_con: '',
                N_com_ear: '',
                O_total: '',
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
                var ws_name = 'FUND'
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
