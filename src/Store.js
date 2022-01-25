import React from "react";

export default ({ storeFunds, login, connected, setConnected, accountBalance, contractBalance, accountStoredBalance, openWithdrawMenu, openDashboardMenu }) => {

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
                if(e.target.value > parseFloat(accountBalance)) {
                    e.target.value = parseFloat(accountBalance);
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
                <h2 className='text-center dashboardHeader'>Store</h2>

                <div className='storeInfo'>
                    <div className='info text-center'>
                        <p><span>Ether Balance</span></p>
                        <p>{parseFloat(accountBalance).toFixed(4)} Ether</p>
                    </div>

                    <div className="input-group">
                        <label htmlFor="amountStore">Amount of Ether to Store</label>
                        <div className="input-group">
                            <input className="amountStore" placeholder="0 Ether" defaultValue={0} onChange={e => changedValue(e)} />
                            <button id="inputValue" className='btn btn-success' onClick={() => {
                                const inputObj = document.querySelector('input');
                                storeFunds(inputObj.value);
                            }}>Store</button>
                        </div>
                    </div>
                    
                </div>

                <div className='dashboardButtons'>
                    {connected ? (
                        <>
                            <button type='button' className='btn btn-store-ether' onClick={() => openDashboardMenu()}>Dashboard</button>
                            <button type='button' className='btn btn-withdraw-ether' onClick={() => openWithdrawMenu()}>Withdraw Ether</button>
                        </>
                    ) : (
                        <button type='button' className='btn btn-store-ether' onClick={async () => {await login().then(setConnected(true))}}>Connect Wallet</button>
                    )}
                    
                </div>
            </div>
        </div>

    );

}