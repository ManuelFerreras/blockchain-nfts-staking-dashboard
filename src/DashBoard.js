import React from 'react';

import nft1 from "./656.png";
import nft2 from "./11.png";
import nft3 from "./355.png";

export default ({ login, connected, setConnected, accountBalance, contractBalance, accountStoredBalance, openWithdrawMenu, openStoreMenu }) => {

    return (

        <div className='dashboard'>

            
            
            <div className='dashboardBg'>
                <h2 className='text-center dashboardHeader'>Dashboard</h2>

                <div className='dashboardInfo'>
                    <div className='nft-collection'>
                        <img src={ nft1 } />
                        <p>Collection: NFT Project Name 1</p>
                        <p>Nfts Balance: 0</p>
                        <p>Token Balance: 0</p>
                        <p>Daily Income: 0</p>
                    </div>

                    <div className='nft-collection'>
                        <img src={ nft2 } />
                        <p>Collection: NFT Project Name 2</p>
                        <p>Nfts Balance: 0</p>
                        <p>Token Balance: 0</p>
                        <p>Daily Income: 0</p>
                    </div>

                    <div className='nft-collection'>
                        <img src={ nft3 } />
                        <p>Collection: NFT Project Name 3</p>
                        <p>Nfts Balance: 0</p>
                        <p>Token Balance: 0</p>
                        <p>Daily Income: 0</p>
                    </div>
                    
                </div>

            </div>
        </div>

    );

}