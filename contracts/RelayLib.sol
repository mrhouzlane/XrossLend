//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

library RelayLib {
  struct Relay {
    address currencyContractAddress;
    address nftContractAddress;
    address from;
    uint256 tokenId;
    uint256 price;
    uint256 expiration;
    string tokenURI;
  }

  function hashRelay(Relay memory relay) internal pure returns (bytes32) {
    return keccak256(abi.encode(relay));
  }
}
