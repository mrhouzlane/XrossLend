const { interfaceName, TokenRolesEnum } = require("@uma/common");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Target Unit Test", function () {
  let timer;
  let optimisticOracle;
  let weth;
  let mockNFT;
  let target;
  let deployer, proposer;

  const utf8ToHex = (input) => ethers.utils.formatBytes32String(input);
  const identifier = utf8ToHex("YES_OR_NO_QUERY");
  const zeroRawValue = { rawValue: "0" };
  const proposalLiveness = 7200;

  beforeEach(async function () {
    [deployer, proposer] = await ethers.getSigners();

    const Timer = await ethers.getContractFactory("Timer");
    timer = await Timer.deploy();
    await timer.deployed();

    const Finder = await ethers.getContractFactory("Finder");
    const finder = await Finder.deploy();
    await finder.deployed();

    const CollateralWhitelist = await ethers.getContractFactory("AddressWhitelist");
    const collateralWhitelist = await CollateralWhitelist.deploy();
    await collateralWhitelist.deployed();

    const IdentifierWhitelist = await ethers.getContractFactory("IdentifierWhitelist");
    const identifierWhitelist = await IdentifierWhitelist.deploy();
    await identifierWhitelist.deployed();

    const ExpandedERC20 = await ethers.getContractFactory("ExpandedERC20");
    weth = await ExpandedERC20.deploy("WETH", "weth", 6);
    await weth.deployed();

    const Store = await ethers.getContractFactory("Store");

    const store = await Store.deploy(zeroRawValue, zeroRawValue, timer.address);
    await store.deployed();

    const MockOracle = await ethers.getContractFactory("MockOracleAncillary");
    const mockOracle = await MockOracle.deploy(finder.address, timer.address);
    await mockOracle.deployed();

    const OptimisticOracle = await ethers.getContractFactory("OptimisticOracleV2");
    optimisticOracle = await OptimisticOracle.deploy(proposalLiveness, finder.address, timer.address);
    await optimisticOracle.deployed();

    await finder.changeImplementationAddress(utf8ToHex(interfaceName.CollateralWhitelist), collateralWhitelist.address);
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.IdentifierWhitelist), identifierWhitelist.address);
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.Store), store.address);
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.OptimisticOracle), optimisticOracle.address); // TODO interfaceName.OptimisticOracleV2
    await finder.changeImplementationAddress(utf8ToHex(interfaceName.Oracle), mockOracle.address);

    await identifierWhitelist.addSupportedIdentifier(identifier);

    await weth.addMember(TokenRolesEnum.MINTER, deployer.address);
    await collateralWhitelist.addToWhitelist(weth.address);

    const MockNFT = await ethers.getContractFactory("MockNFT");
    mockNFT = await MockNFT.deploy();
    await mockNFT.deployed();

    const Target = await ethers.getContractFactory("Target");
    target = await Target.deploy(weth.address, finder.address, timer.address);
    await target.deployed();
  });

  it("lock", async function () {
    const tokenId = 0;
    const relay = {
      currencyContractAddress: weth.address,
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      tokenId,
      price: 0,
      expiration: 9999999999,
      tokenURI: "",
    };
    await expect(target.lock(relay)).to.emit(target, "Lock");
  });

  it("confirm", async function () {
    const tokenId = 0;
    const relay = {
      currencyContractAddress: weth.address,
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      tokenId,
      price: 0,
      expiration: 9999999999,
      tokenURI: "",
    };
    await target.lock(relay);
    const requestLockTimestamp = await target.getCurrentTime();
    const message = await target.encodeRelay(relay);
    await optimisticOracle.proposePriceFor(
      proposer.address,
      target.address,
      identifier,
      requestLockTimestamp,
      message,
      0
    );
    await timer.setCurrentTime(Number(await timer.getCurrentTime()) + proposalLiveness + 1);
    await expect(target.confirm(relay)).to.emit(target, "Confirm");
  });

  it("borrow", async function () {
    const tokenId = 0;
    const relay = {
      currencyContractAddress: weth.address,
      nftContractAddress: mockNFT.address,
      from: deployer.address,
      tokenId,
      price: 0,
      expiration: 9999999999,
      tokenURI: "",
    };
    await target.lock(relay);
    const requestLockTimestamp = await target.getCurrentTime();
    const message = await target.encodeRelay(relay);
    await optimisticOracle.proposePriceFor(
      proposer.address,
      target.address,
      identifier,
      requestLockTimestamp,
      message,
      0
    );
    await timer.setCurrentTime(Number(await timer.getCurrentTime()) + proposalLiveness + 1);
    await target.confirm(relay);
    const requestConfirmTimestamp = await target.getCurrentTime();
    await optimisticOracle.proposePriceFor(
      proposer.address,
      target.address,
      identifier,
      requestConfirmTimestamp,
      message,
      0
    );
    await timer.setCurrentTime(Number(await timer.getCurrentTime()) + proposalLiveness + 1);
    const ERC721 = await ethers.getContractFactory("ERC721");
    const erc721Address = await target.erc721();
    const erc721 = await ERC721.attach(erc721Address);
    await expect(target.borrow(relay, 1)).to.emit(target, "Borrow").emit(erc721, "Transfer");
  });
});
