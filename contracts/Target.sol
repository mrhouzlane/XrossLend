//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@uma/core/contracts/oracle/interfaces/FinderInterface.sol";
import "@uma/core/contracts/oracle/interfaces/OptimisticOracleV2Interface.sol";

import "@uma/core/contracts/common/implementation/AddressWhitelist.sol";
import "@uma/core/contracts/common/implementation/ExpandedERC20.sol";
import "@uma/core/contracts/common/implementation/Timer.sol";
import "@uma/core/contracts/common/implementation/Testable.sol";
import "@uma/core/contracts/oracle/implementation/IdentifierWhitelist.sol";
import "@uma/core/contracts/oracle/implementation/Store.sol";
import "@uma/core/contracts/oracle/implementation/Finder.sol";
import "@uma/core/contracts/oracle/implementation/OptimisticOracleV2.sol";
import "@uma/core/contracts/oracle/test/MockOracleAncillary.sol";

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

import "./WrappedERC721.sol";
import "./RelayLib.sol";

contract Target is Testable {
  event Lock(bytes32 indexed hash, RelayLib.Relay relay, uint256 timestamp);
  event Confirm(bytes32 indexed hash, RelayLib.Relay relay, uint256 timestamp);
  event Borrow(bytes32 indexed hash, RelayLib.Relay relay, uint256 timestamps);

  mapping(bytes32 => bool) private _confirmed;
  mapping(bytes32 => uint256) public requestedAt;

  FinderInterface private _finder;
  IERC20 private _collateralCurrency;
  WrappedERC721 private _wrappedERC721;

  bytes32 private _priceIdentifier = "YES_OR_NO_QUERY";

  constructor(
    address collateralAddress,
    address finderAddress,
    address timerAddress
  ) Testable(timerAddress) {
    _finder = FinderInterface(finderAddress);
    _collateralCurrency = IERC20(collateralAddress);
    _wrappedERC721 = new WrappedERC721();
    _wrappedERC721.initialize();
  }

  function lock(RelayLib.Relay memory relay) public {
    bytes32 hash = hashRelay(relay);
    require(!_confirmed[hash], "Bridge: relay confirmed");
    requestedAt[hash] = getCurrentTime();
    bytes memory message = abi.encode(relay);
    _requestOraclePrice(requestedAt[hash], message);
    emit Lock(hash, relay, requestedAt[hash]);
  }

  function confirm(RelayLib.Relay memory relay) public {
    bytes32 hash = hashRelay(relay);
    require(!_confirmed[hash], "Bridge: relay confirmed");
    _confirmed[hash] = true;
    bytes memory message = encodeRelay(relay);
    _getOraclePrice(requestedAt[hash], message);
    requestedAt[hash] = getCurrentTime();
    _requestOraclePrice(requestedAt[hash], message);
    emit Confirm(hash, relay, requestedAt[hash]);
  }

  function borrow(RelayLib.Relay memory relay, uint256 period) public {
    bytes32 hash = hashRelay(relay);
    require(_confirmed[hash], "Bridge: relay is not confirmed");
    bytes memory message = encodeRelay(relay);
    _getOraclePrice(requestedAt[hash], message);
    uint256 totalAmount = relay.price * period;
    if (totalAmount > 0) {
      IERC20(relay.currencyContractAddress).transferFrom(msg.sender, relay.from, totalAmount);
    }
    _wrappedERC721.mint(msg.sender, uint256(hash), "");
    requestedAt[hash] = getCurrentTime();
    emit Borrow(hash, relay, requestedAt[hash]);
  }

  function erc721() public view returns (address) {
    return address(_wrappedERC721);
  }

  function hashRelay(RelayLib.Relay memory relay) public pure returns (bytes32) {
    return RelayLib.hashRelay(relay);
  }

  function encodeRelay(RelayLib.Relay memory relay) public pure returns (bytes memory) {
    return abi.encode(relay);
  }

  function _requestOraclePrice(uint256 requestedTime, bytes memory message) internal {
    OptimisticOracleV2Interface oracle = _getOptimisticOracle();
    oracle.requestPrice(_priceIdentifier, requestedTime, message, _collateralCurrency, 0);
  }

  function _getOraclePrice(uint256 withdrawalRequestTimestamp, bytes memory message) internal returns (uint256) {
    OptimisticOracleV2Interface oracle = _getOptimisticOracle();
    require(
      oracle.hasPrice(address(this), _priceIdentifier, withdrawalRequestTimestamp, message),
      "Unresolved oracle price"
    );
    int256 oraclePrice = oracle.settleAndGetPrice(_priceIdentifier, withdrawalRequestTimestamp, message);
    if (oraclePrice < 0) {
      oraclePrice = 0;
    }
    return uint256(oraclePrice);
  }

  function _getOptimisticOracle() internal view returns (OptimisticOracleV2Interface) {
    return OptimisticOracleV2Interface(_finder.getImplementationAddress("OptimisticOracle"));
  }
}
