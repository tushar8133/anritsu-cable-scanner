import React from 'react';
import AutotestTable from './AutotestTable';
import connectMachine from '../service';

class Autotest extends React.Component {
    debounceTimer;

    constructor(props) {
        super(props);
        this.state = {
            newData: {}
        };
    }

    render() {
        return (<main id="autotest">
            <label>Output Power Level (dBm): <input type="number" id="outputPowerLevel" onInput={this.savePower} disabled={true}/></label>
            <label>Test Duration (sec): <input type="number" id="testDuration" onInput={this.saveDuration}  disabled={true}/></label>
            <br />
            <input type="text" id="scanner" placeholder="Place scanner here" onInput={this.waitForQRCode.bind(this)} className="backgroundAnimated" autoComplete="off" />
            <AutotestTable addon={this.state.newData} />
            <br />
        </main>);
    }

    waitForQRCode() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout( _ => {
            this.sendCommandToDevice();
        }, 100);
    }

    sendCommandToDevice() {
        var elem = document.getElementById('scanner');
        var qrcode = elem.value;
        if(!qrcode) return;
        elem.disabled = true;

        var power = document.getElementById('outputPowerLevel').value;
        var duration = document.getElementById('testDuration').value;

        connectMachine('INITiate:PIManalyzer:MEASure ON')
        .then( data => {
            return connectMachine(':PIManalyzer:MEASure:VALue?');
        })
        .then( data => {
            console.log(data)
            this.formatFinalData(qrcode, data, power, duration);
            elem.disabled = false;
            elem.value = '';
            elem.focus();
        });
    }

    formatFinalData(qrcode, peakData, power, duration) {
        // TODO: check this String method requirement.
        var peakDataArr = this.formatPeakData(String(peakData));
        var dBc = peakDataArr[0];
        var dBm = peakDataArr[1];
        var timestamp = this.formatDate();

        var currentData = { qrcode, power, duration, dBc, dBm, timestamp };

        this.setState(prevState => ({
            newData: currentData
        }));
    }

    formatPeakData(data) {
        var arr = data.split(',');
        arr[0] = String(arr[0]).trim() + ' dBc';
        arr[1] = String(arr[1]).trim() + ' dBm';
        console.log(">> >> >>",arr)
        return arr;
    }

    formatDate() {
        var dt = new Date();
        return (`${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`);
    }

    savePower(evt) {
        if(evt) {
            if(evt.target.value < 20) evt.target.value = 20;
            if(evt.target.value > 46) evt.target.value = 46;
            localStorage.setItem('power', evt.target.value);
        } else {
            var power = 43;
            try {
                var local = JSON.parse(localStorage.getItem('power'));
                if(local) power = local;
            } catch (e) {
                console.log(e);
            } finally {
                document.getElementById('outputPowerLevel').value = power;
                localStorage.setItem('power', power);
            }
        }
    }

    saveDuration(evt) {
        if(evt) {
            if(evt.target.value < 1) evt.target.value = 1;
            if(evt.target.value > 600) evt.target.value = 600;
            localStorage.setItem('duration', evt.target.value);
        } else {
            var duration = 30;
            try {
                var local = JSON.parse(localStorage.getItem('duration'));
                if(local) duration = local;
            } catch (e) {
                console.log(e);
            } finally {
                document.getElementById('testDuration').value = duration;
                localStorage.setItem('duration', duration);
            }
        }
    }

    componentDidMount() {
        // TODO: try to use these methods from PIM class file
        this.savePower();
        this.saveDuration();
    }

}

export default Autotest;
