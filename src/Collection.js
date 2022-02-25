import React from "react";

import { ethers } from "ethers";

function Collection({ collectionName, nftImage, nftsBalance, tokenBalance, dailyIncome, claimableTokens, claimCollection, collectionId, contract }) {

    return (

        <>

            <div className='nft-collection'>
                <img src={ "https://ipfs.io/ipfs/" + nftImage.replace('ipfs://', '') } />
                <p>Collection: { collectionName }</p>
                <p>Daily NFT Income: { dailyIncome }</p>
                <p>Nfts Balance: { nftsBalance }</p>
                <p>Est. Daily Income: { (nftsBalance * dailyIncome) }</p>
                <p>Token Balance: { tokenBalance }</p>
                <p>Claimable Tokens: { claimableTokens }</p>
                { claimableTokens > 0 ? (
                    <button className="btn btn-success" onClick={async () => {
                        await claimCollection(collectionId);
                    }}>Claim Collection</button>
                ) : (
                    <button className="btn btn-secondary">Claim Collection</button>
                )}
                
            </div>

        </>

    );

}

export default Collection;