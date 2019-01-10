pragma solidity ^0.4.24;

import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

/**
 * @title TokenMintERC20MintableToken
 * @author TokenMint.io
 * @dev Mintable ERC20 token with optional functions implemented.
 * For full specification of ERC-20 standard see:
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */
contract TokenMintERC20MintableToken is ERC20Mintable {

    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string _name, string _symbol, uint8 _decimals, uint256 totalSupply, address feeReceiver, address tokenOwnerAccount) public payable {
      name = _name;
      symbol = _symbol;
      decimals = _decimals;

      // set sender as owner of all tokens
      _mint(tokenOwnerAccount, totalSupply);

      // pay for service fee for contract deployment
      feeReceiver.transfer(msg.value);
    }

    // optional functions from ERC20 stardard

    /**
    * @dev Name of the ERC20 token
    */
    function name() public view returns (string) {
      return name;
    }

    /**
    * @dev Symbol of the ERC20 token
    */
    function symbol() public view returns (string) {
      return symbol;
    }

    /**
    * @dev Number of decimals of the ERC20 token
    */
    function decimals() public view returns (uint8) {
      return decimals;
    }
}