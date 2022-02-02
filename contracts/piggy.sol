// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract nftStaking is Ownable {
    using SafeMath for uint;

    // Variables & Structs.
    struct NftCollection {
        address collectionAddress;
        address rewardsTokenAddress;
        string collectionName;
        string rewardsTokenName;
        uint amountOfTokens;
        uint amountOfTokensGeneratedPerNftPerDay;
        bool ended;
    }

    mapping(address => NftCollection) nftCollections;
    mapping(address => bool) activeCollections;

    mapping(address => mapping(uint => uint)) lastClaimOfNfts;


    // Events.
    event newNftCollection(address);

    
    constructor() {}


    receive() external payable {
        revert(); // Do not accept ETH.
    }


    // Functions.
    function addNewNftCollection( address _newCollectionAddress, string memory _newCollectionName, address _rewardsTokenAddress, string memory _rewardsTokenName, uint _amountOfTokens, uint _amountOfTokensGeneratedPerDay) public onlyOwner {
        require(_newCollectionAddress != address(0) && _rewardsTokenAddress != address(0), "The collection and the Rewards Token Address can not be to the 0 address");
        require(keccak256(abi.encodePacked(_newCollectionName)) != keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(_rewardsTokenName)) != keccak256(abi.encodePacked("")), "Collection and Rewards Token Name can not be empty.");
        require(_amountOfTokens > 0, "The amount of Rewards tokens must be > 0.");
        require(_amountOfTokens % _amountOfTokensGeneratedPerDay == 0, "_amountOfTokens must be a multiple of _amountOfTokensGeneratedPerDay.");

        ERC20(_rewardsTokenAddress).transferFrom(msg.sender, address(this), _amountOfTokens);
        nftCollections[_newCollectionAddress] = NftCollection( _newCollectionAddress, _rewardsTokenAddress, _newCollectionName, _rewardsTokenName, _amountOfTokens, _amountOfTokensGeneratedPerDay, false);

        activeCollections[_newCollectionAddress] = true;
        emit newNftCollection(_newCollectionAddress);
    }

    function claimableTokens( address _collectionAddress ) public view onlyActiveCollections(_collectionAddress) returns(uint) {
        uint _ownedNfts = ERC721(_collectionAddress).balanceOf(msg.sender);
        uint _claimableTokens = 0;
        uint _lastClaim = 0;

        for (uint i = 0; i<_ownedNfts; i++) {
            _lastClaim = lastClaimOfNfts[_collectionAddress][ERC721Enumerable(_collectionAddress).tokenOfOwnerByIndex(msg.sender, i)];
            if(_lastClaim != 0 && _lastClaim % timeStampToDays(block.timestamp) > 0) {
                _claimableTokens += (_lastClaim - timeStampToDays(block.timestamp)).div(1 days).mul(nftCollections[_collectionAddress].amountOfTokensGeneratedPerNftPerDay);
            }
        }
        
        return _claimableTokens;
        
    }


    function timeStampToDays(uint _timestamp) public pure returns(uint) {
        return((_timestamp - _timestamp % 1 days).div(1 days));
    }

    // Modifiers.
    modifier onlyActiveCollections( address _collectionAddress ) {
        require(activeCollections[_collectionAddress], "Collection is not Active.");

        _;
    }

}