// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PiggyBank {

    mapping (address => uint256) balances;
    mapping (address => mapping(address => uint)) ercBalances;
    mapping (address => address[]) ercTokensOf;

    event ERC20Desposit(address, address, uint);
    event ERC20Withdrawal(address, address, uint);
    event EtherWithdrawn(address, uint);
    event EtherDeposit(address, uint);

    function getBalanceOf(address _owner) public view returns(uint256) {
        return balances[_owner];
    }

    function withdrawEther(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Not Enough Balance to Withdraw");

        // First decrease sender balance to avoid reentrancy attack.
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit EtherWithdrawn(msg.sender, _amount);
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
        emit EtherDeposit(msg.sender, msg.value);
    }

    function getErcBalanceOf(address _token, address _owner) public view returns (uint256) {
        return ercBalances[_token][_owner];
    }

    function getERCTokensOf(address _owner) public view returns(address[] memory) {
        return ercTokensOf[_owner];
    }

    // Returns true if this user has ever deposited the specified ERC20.
    function checkIfOwned(address _token) public view returns(bool) {
        bool _result = false;

        for(uint i = 0; i < ercTokensOf[msg.sender].length; i++) {
            if(ercTokensOf[msg.sender][i] == _token) {
                _result = true;
            }
        }

        return _result;
    }

    function depositErcToken(address _token, uint256 amount) public {
        ERC20 token_ = ERC20(_token);

        require(token_.balanceOf(msg.sender) > amount, "Not enough ERC20 Balance.");
        require(token_.allowance(msg.sender, address(this)) < amount, "Approve the contract from your token first.");

        token_.transferFrom(msg.sender, address(this), amount);

        ercBalances[_token][msg.sender] += amount;

        if(!checkIfOwned(_token)) {
            ercTokensOf[msg.sender].push(_token);
        }

        emit ERC20Desposit(_token, msg.sender, amount);
    }

    function withdrawErcToken(address _token, uint256 amount) public {
        ERC20 token_ = ERC20(_token);

        require(ercBalances[_token][msg.sender] > amount, "You don't have enough balance in piggy.");

        // We first update the balance to avoid reentrancy attacks.
        ercBalances[_token][msg.sender] -= amount;

        token_.transfer(msg.sender, amount);

        emit ERC20Withdrawal(_token, msg.sender, amount);
    }

}