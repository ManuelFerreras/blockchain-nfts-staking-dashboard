import React from 'react';

import { ethers } from 'ethers';

// Components
import Collection from "./Collection";

export default ({ contract, collections, connected, ERC20Tokens, ERC721Tokens, claimableTokens, claimCollection }) => {

    return (

        <div className='dashboard'>

            
            
            <div className='dashboardBg'>
                { connected ? (
                    <>
                        <h2 className='text-center dashboardHeader'>Dashboard</h2>

                        <div className='dashboardInfo'>

                            {(collections != undefined && ERC20Tokens != undefined && ERC721Tokens != undefined && claimableTokens != undefined && claimableTokens.length > 0 && collections.length > 0 && ERC721Tokens.length > 0 && ERC20Tokens.length > 0) ? collections.map((elem, i) => {
                                return(
                                    <Collection key={i} nftImage={elem[1]} contract={contract} collectionName={elem[0]} collectionId={elem[6]} claimableTokens={ethers.utils.formatUnits(claimableTokens[i], 18)} claimCollection={claimCollection} nftsBalance={ethers.utils.formatUnits(ERC721Tokens[i], 0)} tokenBalance={ethers.utils.formatUnits(ERC20Tokens[i], 18)} dailyIncome={ethers.utils.formatUnits(elem[5], 18)} />
                                )}) : (
                                <>
                                    <h2 className='text-center collections-text '>No Collections to Show</h2>
                                </>
                            )}

                        </div>
                    </>
                ) : (
                    <>
                        <h2 className='text-center connect-text'>Connect with Wallet</h2>
                    </>
                ) }
                
            </div>
            
        </div>

    );

}