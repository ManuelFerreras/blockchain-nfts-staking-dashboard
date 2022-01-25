import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faWallet, faInbox } from '@fortawesome/free-solid-svg-icons';


export default ({ openDashboardMenu }) => {

    return(

        <div className='sideBar'>

            <nav className='sideBarMenuList'>
                <a onClick={e => {e.preventDefault(); openDashboardMenu();}} ><FontAwesomeIcon icon={faChartLine} /></a>
                <a onClick={e => {e.preventDefault(); openDashboardMenu();}} ><FontAwesomeIcon icon={faWallet} /></a>
                <a onClick={e => {e.preventDefault(); openDashboardMenu();}} ><FontAwesomeIcon icon={faInbox} /></a>
                
            </nav>

        

        </div>
    );

}