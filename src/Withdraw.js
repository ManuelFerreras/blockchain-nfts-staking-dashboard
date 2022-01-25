import React from "react";

export default ({ withdrawFunds, login, connected, setConnected, accountBalance, contractBalance, accountStoredBalance, openDashboardMenu, openStoreMenu }) => {

    const checkValue = e => {
        if(isNaN(parseFloat(e.target.value))) {
            return false;
        } else {
            return true;
        }
    }

    const changedValue = e => {
        if(!checkValue(e)) {
            e.target.value = 0;
        } else {
            if(e.target.value[e.target.value.length - 1] != '.') {
                e.target.value = parseFloat(e.target.value);
                if(e.target.value > parseFloat(accountStoredBalance)) {
                    e.target.value = parseFloat(accountStoredBalance);
                }
                if(e.target.value < 0) {
                    e.target.value = 0;
                }
            }
        }
    }

    return(

        <div className='container dashboard'>
            
            <div className='dashboardBg'>
                <h2 className='text-center dashboardHeader'>Withdraw</h2>

                <div className='storeInfo'>
                    <div className='info text-center'>
                        <p><span>Your Savings</span></p>
                        <p>{parseFloat(accountStoredBalance).toFixed(4)} Ether</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="amountStore">Amount of Ether to Withdraw</label>
                        <div className="input-group">
                            <input className="amountStore" placeholder="0 Ether" defaultValue={0} onChange={e => changedValue(e)} />
                            <button id="inputValue" className='btn btn-success' onClick={() => {
                                const inputObj = document.querySelector('input');
                                withdrawFunds(inputObj.value);
                            }}>Withdraw</button>
                        </div>
                    </div>
                    
                </div>

                <div className='dashboardButtons'>
                    {connected ? (
                        <>
                            <button type='button' className='btn btn-withdraw-ether' onClick={() => openDashboardMenu()}>Dashboard</button>
                            <button type='button' className='btn btn-store-ether' onClick={() => openStoreMenu()}>Store Ether</button>
                        </>
                    ) : (
                        <button type='button' className='btn btn-store-ether' onClick={async () => {await login().then(setConnected(true))}}>Connect Wallet</button>
                    )}
                    
                </div>
            </div>
        </div>

    );

}