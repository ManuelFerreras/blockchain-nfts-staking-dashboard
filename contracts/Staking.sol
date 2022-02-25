// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract stakingDApp {

    address public owner;

    struct Collection {
        string collectionName;
        string collectionPreviewImageUrl;
        address collectionAddress;
        address collectionRewardsTokenAddress;
        uint nftClaims;
        uint rewardedTokensPerClaim;
        uint collectionId;
    }

    Collection[] collections;
    mapping (uint => mapping (uint => uint)) claimedDaysPerNft;
    mapping (uint => mapping(uint => uint)) lastClaimTimePerNft;

    constructor () {
        owner = msg.sender;
    }

    // Events
    event collectionChanged(uint);
    event newCollection(Collection);
    event claimedTokens(uint, uint);
    event ERC20Withdrawn(address, uint);

    function createNewCollection(
        string memory _collectionName,
        string memory _collectionPreviewImageUrl,
        address _collectionAddress,
        address _collectionRewardsTokenAddress,
        uint _nftClaims,
        uint _rewardedTokensPerClaim

    ) public onlyOwner {
        collections.push(Collection(_collectionName, _collectionPreviewImageUrl, _collectionAddress, _collectionRewardsTokenAddress, _nftClaims, _rewardedTokensPerClaim * 10 ** ERC20(_collectionRewardsTokenAddress).decimals(), collections.length));

        emit newCollection(collections[collections.length - 1]);
    }

    function modifyCollection (
        string memory _collectionName,
        string memory _collectionPreviewImageUrl,
        address _collectionAddress,
        address _collectionRewardsTokenAddress,
        uint _collectionId
    ) public onlyOwner {
        collections[_collectionId] = Collection(_collectionName, _collectionPreviewImageUrl, _collectionAddress, _collectionRewardsTokenAddress, collections[_collectionId].nftClaims, collections[_collectionId].rewardedTokensPerClaim, _collectionId);

        emit collectionChanged(_collectionId);
    }

    function getCollections() public view returns(Collection[] memory, uint[] memory, uint[] memory, uint[] memory) {
        Collection[] memory _collections = collections;
        uint[] memory _ERC20TokenBalances = new uint[](_collections.length);
        uint[] memory _ERC721TokenBalances = new uint[](_collections.length);
        uint[] memory _claimableTokens = new uint[](_collections.length);

        for (uint i = 0; i < collections.length; i++) {
            _ERC20TokenBalances[i] = ERC20(collections[i].collectionRewardsTokenAddress).balanceOf(msg.sender);
            _ERC721TokenBalances[i] = ERC721(collections[i].collectionAddress).balanceOf(msg.sender);
            _claimableTokens[i] = getClaimableTokens(i);
        }

        return(_collections, _ERC20TokenBalances, _ERC721TokenBalances, _claimableTokens);
    }

    function claimCollection( uint _collectionId ) public {
        uint withdrawn = 0;
        uint _nftId;
        ERC20 _token = ERC20(collections[_collectionId].collectionRewardsTokenAddress);
        for(uint i = 0; i < ERC721Enumerable(collections[_collectionId].collectionAddress).balanceOf(msg.sender); i++) {
            _nftId = ERC721Enumerable(collections[_collectionId].collectionAddress).tokenOfOwnerByIndex(msg.sender, i);
            if(checkDaysClaimedByNft(_collectionId, _nftId)) {
                require(_token.balanceOf(address(this)) >= (withdrawn + collections[_collectionId].rewardedTokensPerClaim), "Not enough tokens in contract reserve.");

                claimedDaysPerNft[_collectionId][_nftId] += 1;
                lastClaimTimePerNft[_collectionId][_nftId] = block.timestamp;

                withdrawn += collections[_collectionId].rewardedTokensPerClaim;
            }
        }

        if(withdrawn > 0) {
            _token.transfer(msg.sender, withdrawn);

            emit claimedTokens(_collectionId, withdrawn);
        }
    }

    function getClaimableTokens( uint _collectionId ) public view returns (uint) {
        uint withdrawable = 0;
        uint _nftId;
        for(uint i = 0; i < ERC721Enumerable(collections[_collectionId].collectionAddress).balanceOf(msg.sender); i++) {
            _nftId = ERC721Enumerable(collections[_collectionId].collectionAddress).tokenOfOwnerByIndex(msg.sender, i);
            if(checkDaysClaimedByNft(_collectionId, _nftId)) {
                withdrawable += collections[_collectionId].rewardedTokensPerClaim;
            }
        }

        return withdrawable;
    }

    function checkDaysClaimedByNft( uint _collectionId, uint _nftId ) public view returns(bool) {
        if (claimedDaysPerNft[_collectionId][_nftId] < collections[_collectionId].nftClaims && block.timestamp - lastClaimTimePerNft[_collectionId][_nftId] >= 1 days) {
            return true;
        } else {
            return false;
        }
    }

    function withdrawERC20Tokens( address _tokenAddress, uint _amount ) public onlyOwner {
        ERC20(_tokenAddress).transfer(msg.sender, _amount);

        emit ERC20Withdrawn(_tokenAddress, _amount);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not the owner.");

        _;    
    }

}