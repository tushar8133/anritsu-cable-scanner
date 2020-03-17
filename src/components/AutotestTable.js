import React from 'react';
import XLSX from 'xlsx';

class AutotestTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: [{ "qrcode": "a", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:29" }, { "qrcode": "b", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:31" }, { "qrcode": "c", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:33" }, { "qrcode": "d", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:34" }, { "qrcode": "e", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:36" }, { "qrcode": "f", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:37" }, { "qrcode": "g", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:39" }, { "qrcode": "h", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:44" }, { "qrcode": "i", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:46" }, { "qrcode": "j", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:48" }, { "qrcode": "k", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:51" }, { "qrcode": "l", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:52" }, { "qrcode": "m", "power": "41", "duration": "33", "dBm": "u", "dBc": "n", "timestamp": "13:02:54" }]
        };
    }

    componentWillReceiveProps(props) {
        var finalData = this.checkDuplicate(this.state.tableData, props.addon);
        this.setState({ tableData: finalData });
    }

    componentDidUpdate() {
        var scrollDiv = document.querySelector('#autotesttable > div');
        scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }

    render() {
        return (
            <main id="autotesttable" align="center">
                <div>
                    <table id="data-table" border="1">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Serial No.</th>
                                <th>Power</th>
                                <th>Duration</th>
                                <th>dBm</th>
                                <th>dBc</th>
                                <th>Timestamp</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tableData.map((row, index) => <tr key={row.qrcode}><td>{index + 1}</td><td>{row.qrcode}</td><td>{row.power}</td><td>{row.duration}</td><td>{row.dBm}</td><td>{row.dBc}</td><td>{row.timestamp}</td><td><button onClick={_ => this.deleteRow(index)}>&#10005;</button></td></tr>)}
                        </tbody>
                    </table>
                </div>
                <button onClick={_ => this.exportData()}>Save Excel</button>
            </main>);
    }

    deleteRow(index) {
        console.log(index);
        var duplicateState = [...this.state.tableData];
        duplicateState.splice(index, 1);
        this.setState({
            tableData: duplicateState
        })
    }

    checkDuplicate(oldData, newData) {
        var unique = oldData.filter((val, index) => {
            return (val.qrcode !== newData.qrcode);
        });
        unique.push(newData)
        return unique;
    }

    formatDate(type) {
        var dt = new Date();
        if(type === 'print') return (`${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`);
        if(type === 'save') return (`${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')}  (${dt.getHours().toString().padStart(2, '0')}${dt.getMinutes().toString().padStart(2, '0')})`);
    }

    exportData() {
        var person = prompt('Please enter OPERATOR NAME');
        if (!person) {
            alert('OPERATOR NAME is required!');
            return false;
        }
        console.table(this.state.tableData)
        var data = [...this.state.tableData];
        var newData = data.map((obj, index) => {
            return Object.assign({ index: String(index + 1) }, obj)
        })
        // console.table(newData);
        this.xlsxModule(person, newData);
    }

    xlsxModule(person, data) {
        var ws = XLSX.utils.json_to_sheet([{ A: 'Operator Name', B: person }, { A: 'Date', B: this.formatDate('print') }], { header: ['A', 'B'], skipHeader: true });
        XLSX.utils.sheet_add_json(ws, data, { skipHeader: false, origin: 'A4' });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);
        XLSX.writeFile(wb, `Anritsu Test -- ${this.formatDate('save')}.xlsx`);
    }
}

export default AutotestTable;
