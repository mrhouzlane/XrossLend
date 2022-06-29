//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "./RelayLib.sol";

contract Source {
  event Rent(bytes32 indexed hash, RelayLib.Relay relay);
  event Withdraw(bytes32 indexed hash, RelayLib.Relay relay);

  mapping(bytes32 => RelayLib.Relay) _relays;

  function rent(RelayLib.Relay memory relay) public {
    require(relay.from == IERC721(relay.nftContractAddress).ownerOf(relay.tokenId), "Source: from invalid");
    IERC721(relay.nftContractAddress).transferFrom(relay.from, address(this), relay.tokenId);
    bytes32 hash = RelayLib.hashRelay(relay);
    _relays[hash] = relay;
    emit Rent(hash, relay);
  }

  function withdraw(RelayLib.Relay memory relay) public {
    bytes32 hash = RelayLib.hashRelay(relay);
    require(_relays[hash].expiration <= block.timestamp, "Source: too early");
    delete _relays[hash];
    IERC721(relay.nftContractAddress).transferFrom(address(this), relay.from, relay.tokenId);
    emit Withdraw(hash, relay);
  }
}
