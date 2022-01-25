import React from 'react';

export default ({ login, setConnected, connected, account }) => {

    return(
        <>
            {connected ? (
                <button type='button' className='btn btn-connect'>{account}</button>
            ) : (
                <button type='button' className='btn btn-connect' onClick={async () => {await login().then(setConnected(true))}}>Connect Wallet</button>
            )}
        </>

    );

}