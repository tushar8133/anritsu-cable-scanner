import React from 'react';
import { NavLink as Link } from "react-router-dom";

class Header extends React.Component {

    render() {
      return (
        <header id="header-page">

          <table>
            <tbody>
              <tr>
                <td><img src="logo.png" alt="Anritsu Logo" /></td>
                <td><h2>Anritsu PIM Analyzer Automation GUI</h2>
                  <nav>
                    <li onClick={this.divert}><Link activeClassName="navLink" exact to="/"><button>Connection</button></Link></li>
                    <li><Link activeClassName="navLink" to="/command"><button>SCPI Commands</button></Link></li>
                    <li><Link activeClassName="navLink" to="/pim"><button>PIM Mode</button></Link></li>
                    <li><Link activeClassName="navLink" to="/autotest"><button>Auto Test</button></Link></li>
                  </nav></td>
              </tr>
            </tbody>
          </table>

          <hr />
        </header>
      )
    }

    divert(){
      window.location.href = ("/");
    }

}

export default Header;
