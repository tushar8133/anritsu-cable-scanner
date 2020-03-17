import React from 'react';
import connectMachine from '../service';

class Command extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (
            <main id='command-page'>

                <button onClick={_ => this.sendCommand('*IDN?')}>*IDN?</button>
                <button onClick={_ => this.sendCommand('*ABC?')}>*ABC?</button>
                <button onClick={_ => this.sendCommand('*DEF?')}>*DEF?</button>
                <button onClick={_ => this.sendCommand('*XYZ?')}>*XYZ?</button>
                <span className="spacer" />
                <input type="text" id="custom-cmd" placeholder="SCPI command" />
                <button onClick={_ => this.sendCommand(document.getElementById('custom-cmd').value)}>Send</button>
                <span className="spacer" />
                <textarea id="textarea" rows="10" cols="60"></textarea>
            </main>
        )
    }

    sendCommand(cmd) {
        connectMachine(cmd).then( data => {
            this.setResponse(data);
        });
    }

    setResponse(resp) {
        document.getElementById('textarea').value = String(resp);
    }
}

export default Command;
