import React, { useRef } from "react";
import { ethers } from "ethers";

export default ({ storeErcFunds, login, connected, setConnected, accountBalance, contractBalance, accountStoredBalance, openWithdrawMenu, openDashboardMenu }) => {

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
                if(e.target.value < 0) {
                    e.target.value = 0;
                }
            }
        }
    }

    
    const inputToken = useRef(null);
    const inputTokens = useRef(null);

    return(

        <div className='container dashboard'>
            
            <div className='dashboardBg'>
                <h2 className='text-center dashboardHeader'>Store ERC20 Token</h2>

                <div className='storeInfo'>
                    <div className="input-group erc">
                        <label htmlFor="tokenAddress">Token Address</label>
                        <input ref={inputToken} id="#tokenAddress" className="tokenAddress" placeholder="0x..." />
                    </div>

                    <div className="input-group erc">
                        <label htmlFor="amountStore">Amount of Tokens to Store</label>
                        <input ref={inputTokens} id="tokensAmount" className="amountStore" placeholder="0 Ether" defaultValue={0} onChange={e => changedValue(e)} />
                    </div>
                    
                </div>
                

                <div className='dashboardButtons'>
                    {connected ? (
                        <>
                        <button id="inputValue" className='btn btn-store-ether' onClick={() => {
                            try {
                                ethers.utils.getAddress(inputToken.current.value);
                            } catch (error) {
                                alert("Invalid Token Address");
                            }
                            storeErcFunds(inputToken.current.value, inputTokens.current.value);
                            inputToken.current.value = "";
                            inputTokens.current.value = "";
                        }}>Store</button>
                        </>
                    ) : (
                        <button type='button' className='btn btn-store-ether' onClick={async () => {await login().then(setConnected(true))}}>Connect Wallet</button>
                    )}
                    
                </div>
            </div>
        </div>

    );

}