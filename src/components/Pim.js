import React from 'react';
import connectMachine from '../service';

class Pim extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        this.savePower();
        this.saveDuration();
    }

    render() {
        return (
            <main id='pim-page'>
            	<label>Output Power Level (dBm): <input type="number" id="outputPowerLevel" onInput={this.savePower} /></label>
	            <label>Test Duration (sec): <input type="number" id="testDuration" onInput={this.saveDuration} /></label>
	            <br />
                <button onClick={ _ => {this.pimvstimeHandler()} }>PIM Vs Time</button>
                <button onClick={ _ => {this.changingtopimanalyzerHandler()} }>Changing to PIM Analyzer</button>
                <button onClick={ _ => {this.setpowerandduration()} }>Set Power & Duration</button>
                <button onClick={ _ => {this.sweptpimHandler()} }>Swept PIM</button>
                <button onClick={ _ => {this.dtpHandler()} }>DTP</button>
                <span className="spacer" />
                <textarea id="textarea" rows="10" cols="60"></textarea>
            </main>
        )
    }

    pimvstimeHandler(){
    	connectMachine('SENSe:PIManalyzer:MODe PIM')
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    setpowerandduration() {
        connectMachine(':PIManalyzer:OUTPut:POWer ' + localStorage.getItem('power'))
        .then( data => {
            return connectMachine(':PIManalyzer:TEST:DURation ' + localStorage.getItem('duration'));
        })
        .then( data => {
            this.setResponse(data);
        });
    }

    sweptpimHandler(){
    	connectMachine(':PIManalyzer:MODe PIMSwp')
    	.then( data => {
    		return connectMachine(':INSTrument:NSELect 46');
    	})
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    changingtopimanalyzerHandler() {
        connectMachine(':INSTrument:NSELect 46')
        .then( data => {
            this.setResponse(data);
        });
    }

    dtpHandler(){
    	connectMachine(':PIManalyzer:MODe DTP')
    	.then( data => {
    		this.setResponse(data);
    	});
    }

    setResponse(resp) {
        document.getElementById('textarea').value = String(resp);
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
    
}

export default Pim;
